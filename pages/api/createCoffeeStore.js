import { table, getMinifiedRecords } from '@lib/airtable';

export default async function createCoffeeStore(req, res) {
  const { id, name, neighbourhood, address, imgUrl, voting } = req.body;

  if (req.method === 'POST') {
    // find a record
    try {
      const findCoffeeStores = await table
        .select({
          filterByFormula: `id="${id}"`,
        })
        .firstPage();
      if (findCoffeeStores.length !== 0) {
        const coffeeStores = getMinifiedRecords(findCoffeeStores);
        res.json(coffeeStores);
      } else {
        if (name) {
          const createdRecords = await table.create([
            {
              fields: {
                id,
                name,
                neighbourhood,
                address,
                imgUrl,
                voting,
              },
            },
          ]);

          const record = getMinifiedRecords(createdRecords);
          res.json(record);
        }
      }
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  } else {
    res.json({ method: 'GET' });
  }
}
