(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PetHealthModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const STORAGE_KEY = 'peijia-pet-health-demo-v3';
  const DEFAULT_DATE = '2024-05-20';
  const TYPES = ['feed', 'walk', 'health'];
  const STATUSES = ['良好', '需要观察', '需要关注'];
  let sequence = 0;
  const copy = (value) => JSON.parse(JSON.stringify(value));
  const fail = (message) => { throw new Error(message); };
  const text = (value, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';

  function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T12:00:00Z`);
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }

  function legacyDate(value, fallback) {
    if (validDate(value)) return value;
    const match = typeof value === 'string' && value.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
    const candidate = match && `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
    return validDate(candidate) ? candidate : fallback;
  }

  function number(value, label, min, max) {
    if (typeof value === 'boolean' || value === null || value === '' ||
        (typeof value === 'string' && !value.trim())) fail(`请填写${label}`);
    const result = Number(value);
    if (!Number.isFinite(result) || result < min || result > max) fail(`${label}应在 ${min} 到 ${max} 之间`);
    return result;
  }

  function status(value) {
    if (value === '建议复诊') return '需要关注';
    if (STATUSES.includes(value)) return value;
    if (['健康', '正常', '非常好'].includes(value)) return '良好';
    return '';
  }

  function defaults(date = DEFAULT_DATE) {
    if (!validDate(date)) fail('请选择有效的日期');
    const pets = {
      mimi: {
        id: 'mimi', name: '咪咪', kind: '英短', animal: '猫咪', age: '2岁', height: '15 cm',
        weight: 4, food: '猫粮', portion: 50, feedGoal: 3, birthday: '2022-05-20',
        chip: '猫咪-0520', color: '蓝乳色', favorite: '金枪鱼冻干', allergies: '暂无',
        notes: '喜欢晒太阳和肚皮按摩',
        vaccines: [{ name: '狂犬疫苗', due: '2024年10月到期', done: false }, { name: '猫三联', due: '已完成', done: true }],
        history: ['2024年5月18日 胃口不错', '2024年4月29日 常规体检正常'],
      },
      lucky: {
        id: 'lucky', name: '旺旺', kind: '柯基', animal: '狗狗', age: '3岁', height: '28 cm',
        weight: 10, food: '狗粮', portion: 80, feedGoal: 2, birthday: '2021-09-12',
        chip: '狗狗-0912', color: '橘白色', favorite: '鸡肉小饼干', allergies: '花粉轻微敏感',
        notes: '喜欢捡球和外出散步',
        vaccines: [{ name: '狂犬疫苗', due: '2024年9月到期', done: false }, { name: '犬四联', due: '已完成', done: true }],
        history: ['2024年5月19日 户外遛弯 45 分钟', '2024年5月16日 皮肤状态稳定'],
      },
    };
    const seed = (id, pet, type, time, fields) => ({ id, pet, type, date, time, food: '', amount: 0, minutes: 0, activity: '', status: '良好', symptoms: [], note: '', photo: '', ...fields });
    return {
      version: 4, date, view: 'home', pet: 'mimi', recordType: 'feed', pets,
      records: [
        seed('mimi-feed-1', 'mimi', 'feed', '08:30', { food: '猫粮', amount: 50, note: '今天胃口不错' }),
        seed('mimi-walk-1', 'mimi', 'walk', '10:10', { activity: '室内活动', minutes: 30, note: '状态轻松' }),
        seed('mimi-health-1', 'mimi', 'health', '11:20', { symptoms: ['正常'], note: '精神稳定' }),
        seed('mimi-feed-2', 'mimi', 'feed', '12:30', { food: '猫粮', amount: 50, note: '午饭已完成' }),
        seed('lucky-walk-1', 'lucky', 'walk', '07:45', { activity: '户外遛弯', minutes: 45, note: '精神很好' }),
        seed('lucky-feed-1', 'lucky', 'feed', '08:10', { food: '狗粮', amount: 80, note: '早餐已完成' }),
      ],
    };
  }

  function validatePet(current, patch) {
    const result = copy(current);
    if (!patch || typeof patch !== 'object' || Array.isArray(patch)) fail('宠物档案格式不正确');
    for (const key of ['name', 'kind', 'animal', 'age', 'height', 'food', 'chip', 'color', 'favorite', 'allergies', 'notes']) {
      if (!Object.prototype.hasOwnProperty.call(patch, key)) continue;
      if (typeof patch[key] !== 'string') fail('请填写有效的档案文字');
      if (patch[key].length > (key === 'notes' ? 1000 : 100)) fail('档案文字过长，请简要填写');
      if (['name', 'kind', 'age'].includes(key) && !patch[key].trim()) fail('宠物昵称、品种和年龄不能为空');
      result[key] = patch[key].trim();
    }
    for (const [key, label, min, max] of [['weight', '体重', 0.1, 300], ['portion', '喂食量', 0.1, 10000], ['feedGoal', '每日喂食次数', 1, 20]]) {
      if (Object.prototype.hasOwnProperty.call(patch, key)) result[key] = number(patch[key], label, min, max);
    }
    if (!Number.isInteger(result.feedGoal)) fail('每日喂食次数应为整数');
    if (Object.prototype.hasOwnProperty.call(patch, 'birthday')) {
      if (patch.birthday !== '' && !validDate(patch.birthday)) fail('请选择有效的生日');
      result.birthday = patch.birthday;
    }
    if (Object.prototype.hasOwnProperty.call(patch, 'vaccines')) {
      if (!Array.isArray(patch.vaccines)) fail('疫苗记录格式不正确');
      result.vaccines = patch.vaccines.map((vaccine) => {
        if (!vaccine || !text(vaccine.name)) fail('请填写疫苗名称');
        return { name: text(vaccine.name, 100), due: text(vaccine.due, 100), done: Boolean(vaccine.done) };
      });
    }
    if (Object.prototype.hasOwnProperty.call(patch, 'history')) {
      if (!Array.isArray(patch.history) || patch.history.some((entry) => typeof entry !== 'string')) fail('历史记录格式不正确');
      result.history = patch.history.map((entry) => text(entry));
    }
    return result;
  }

  function validateRecord(state, record) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) fail('记录格式不正确');
    if (!state.pets[record.pet]) fail('请选择已有的宠物');
    if (!TYPES.includes(record.type)) fail('请选择喂食、遛弯或健康记录');
    const date = record.date ?? state.date ?? DEFAULT_DATE;
    if (!validDate(date)) fail('请选择有效的记录日期');
    const time = record.time ?? '08:30';
    if (typeof time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) fail('请选择有效的记录时间');
    if (record.id !== undefined && (typeof record.id !== 'string' || !record.id.trim() || record.id.length > 120)) fail('记录编号无效');
    if (record.note !== undefined && (typeof record.note !== 'string' || record.note.length > 2000)) fail('备注请控制在 2000 字以内');
    const photo = record.photo ?? '';
    if (typeof photo !== 'string' || (photo && !/^data:image\/(png|jpe?g|webp|gif|avif);base64,[A-Za-z0-9+/=\s]+$/i.test(photo))) fail('请选择有效的图片文件');
    const result = {
      id: record.id || `record-${Date.now().toString(36)}-${++sequence}`,
      pet: record.pet, type: record.type, date, time,
      food: '', amount: 0, minutes: 0, activity: '', status: '良好', symptoms: [],
      note: text(record.note, 2000), photo,
    };
    if (record.type === 'feed') {
      result.food = text(record.food, 100);
      if (!result.food) fail('请填写食物名称');
      result.amount = number(record.amount, '喂食量（克）', 0.1, 10000);
      result.detail = `${result.food} ${result.amount}g`;
    }
    if (record.type === 'walk') {
      result.activity = text(record.activity, 100);
      if (!result.activity) fail('请填写活动类型');
      result.minutes = number(record.minutes, '活动分钟数', 0, 1440);
      result.detail = `${result.activity} ${result.minutes} 分钟`;
    }
    if (record.type === 'health') {
      if (record.symptoms !== undefined && (!Array.isArray(record.symptoms) || record.symptoms.some((item) => typeof item !== 'string'))) fail('请选择有效的健康状态');
      result.symptoms = [...new Set((record.symptoms || []).map((item) => text(item, 100)).filter(Boolean))];
      if (result.symptoms.some((item) => !['正常', '健康', '无异常'].includes(item))) {
        result.symptoms = result.symptoms.filter((item) => !['正常', '健康', '无异常'].includes(item));
      }
      const selectedStatus = status(record.status ?? '良好');
      if (!selectedStatus) fail('请选择良好、需要观察或需要关注');
      result.status = result.symptoms.some((item) => !['正常', '健康', '无异常'].includes(item)) && selectedStatus === '良好' ? '需要观察' : selectedStatus;
      result.detail = result.symptoms.join('、') || result.status;
    }
    return result;
  }

  function hydrate(saved, date = DEFAULT_DATE) {
    const base = defaults(date);
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return base;
    if (validDate(saved.date)) base.date = saved.date;
    // Migrate each field independently so one malformed field does not erase a valid custom nickname.
    if (saved.pets && typeof saved.pets === 'object') {
      for (const id of Object.keys(base.pets)) {
        const legacy = saved.pets[id];
        if (!legacy || typeof legacy !== 'object') continue;
        for (const [key, value] of Object.entries(legacy)) {
          const next = key === 'birthday' ? legacyDate(value, base.pets[id].birthday)
            : key === 'name' && value === '喵咪' ? '咪咪'
              : key === 'name' && value === '旺财' ? '旺旺' : value;
          try { base.pets[id] = validatePet(base.pets[id], { [key]: next }); } catch { /* Keep the known-valid field. */ }
        }
      }
    }
    base.pet = Object.prototype.hasOwnProperty.call(base.pets, saved.pet) ? saved.pet : 'mimi';
    base.view = ['home', 'record', 'health', 'profile', 'design'].includes(saved.view) ? saved.view : 'home';
    base.recordType = TYPES.includes(saved.recordType) ? saved.recordType : 'feed';
    if (!Array.isArray(saved.records)) return base;
    const ids = new Set();
    base.records = [];
    for (const [index, old] of saved.records.entries()) {
      if (!old || typeof old !== 'object' || !base.pets[old.pet] || !TYPES.includes(old.type)) continue;
      const currentPet = base.pets[old.pet];
      const detail = text(old.detail);
      const amount = detail.match(/(\d+(?:\.\d+)?)\s*(?:g|克)/i);
      const minutes = detail.match(/(\d+(?:\.\d+)?)\s*分钟/);
      let id = text(old.id, 120) || `migrated-${old.pet}-${index}`;
      if (ids.has(id)) id = `migrated-${old.pet}-${index}-${id}`.slice(0, 120);
      while (ids.has(id)) id = `migrated-${++sequence}-${index}`;
      try {
        const migrated = validateRecord(base, {
          ...old, id,
          date: legacyDate(old.date, validDate(saved.date) ? saved.date : date),
          time: /^([01]\d|2[0-3]):[0-5]\d$/.test(old.time) ? old.time : '12:00',
          food: old.food ?? (detail.replace(/\s*\d+(?:\.\d+)?\s*(?:g|克).*$/i, '') || currentPet.food),
          amount: old.amount ?? (amount ? Number(amount[1]) : currentPet.portion),
          minutes: old.minutes ?? (minutes ? Number(minutes[1]) : 0),
          activity: old.activity ?? (detail.replace(/\s*\d+(?:\.\d+)?\s*分钟.*$/, '') || (old.pet === 'mimi' ? '室内活动' : '户外遛弯')),
          status: status(old.status) || status(old.note) || '良好',
          symptoms: Array.isArray(old.symptoms) ? old.symptoms : old.type === 'health' ? detail.split('、').filter(Boolean) : [],
          photo: typeof old.photo === 'string' ? old.photo : '',
          note: text(old.note, 2000),
        });
        ids.add(migrated.id);
        base.records.push(migrated);
      } catch { /* Skip corrupt rows without preventing the demo from opening. */ }
    }
    return base;
  }

  function recordsFor(state, petId = state.pet, date) {
    return copy(state.records.filter((record) => record.pet === petId && (date === undefined || record.date === date)));
  }

  function lastRecord(state, petId, type, date) {
    return recordsFor(state, petId, date).filter((record) => record.type === type)
      .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)).at(-1) || null;
  }

  function summary(state, petId = state.pet, date = state.date || DEFAULT_DATE) {
    if (!state.pets[petId]) fail('找不到这个宠物的档案');
    const records = recordsFor(state, petId, date);
    const latestHealth = lastRecord(state, petId, 'health', date);
    return {
      feedDone: records.filter((record) => record.type === 'feed').length,
      feedGoal: state.pets[petId].feedGoal,
      walkCount: records.filter((record) => record.type === 'walk').length,
      walkMinutes: records.filter((record) => record.type === 'walk').reduce((sum, record) => sum + record.minutes, 0),
      health: latestHealth?.status || '待记录',
    };
  }

  function upsertRecord(state, record) {
    const existing = record?.id ? state.records.find((item) => item.id === record.id) : null;
    if (existing && record.pet && existing.pet !== record.pet) fail('不能将已有记录改到另一个宠物的档案');
    const next = validateRecord(state, { ...existing, ...record });
    const result = copy(state);
    const index = result.records.findIndex((item) => item.id === next.id);
    if (index >= 0) result.records[index] = next;
    else result.records.push(next);
    return result;
  }

  function removeRecord(state, id) {
    if (typeof id !== 'string' || !state.records.some((record) => record.id === id)) fail('没有找到要删除的记录');
    const result = copy(state);
    result.records = result.records.filter((record) => record.id !== id);
    return result;
  }

  function updatePet(state, petId, patch) {
    if (!state.pets[petId]) fail('找不到这个宠物的档案');
    const updated = validatePet(state.pets[petId], patch);
    const result = copy(state);
    result.pets[petId] = updated;
    return result;
  }

  function persist(storage, state) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }

  return { STORAGE_KEY, DEFAULT_DATE, TYPES, STATUSES, defaults, hydrate, summary, recordsFor, upsertRecord, removeRecord, updatePet, lastRecord, persist };
});
