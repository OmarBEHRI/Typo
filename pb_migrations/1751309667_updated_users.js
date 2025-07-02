/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number2253748948",
    "max": null,
    "min": null,
    "name": "dailyExperience",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number1604950194",
    "max": null,
    "min": null,
    "name": "weeklyExperience",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "number93372675",
    "max": null,
    "min": null,
    "name": "experience",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "number4189841083",
    "max": null,
    "min": null,
    "name": "overallSpeed",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("number2253748948")

  // remove field
  collection.fields.removeById("number1604950194")

  // remove field
  collection.fields.removeById("number93372675")

  // remove field
  collection.fields.removeById("number4189841083")

  return app.save(collection)
})
