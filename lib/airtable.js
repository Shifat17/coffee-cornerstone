const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.BASE_API_KEY
);

const table = base('discover-coffee-stores');

const getMinifiedRecords = (records) => {
  const coffeeStores = records.map((record) => {
    return {
      recordId: record.id,
      ...record.fields,
    };
  });
  return coffeeStores;
};

const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findCoffeeStoreRecords);
};

export { table, getMinifiedRecords, findRecordByFilter };
