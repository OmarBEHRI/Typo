/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2922081765")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number2683269900",
    "max": null,
    "min": null,
    "name": "targetSeconds",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number683773778",
    "max": null,
    "min": null,
    "name": "completedSeconds",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2922081765")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number2683269900",
    "max": null,
    "min": null,
    "name": "targetMinutes",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number683773778",
    "max": null,
    "min": null,
    "name": "completedMinutes",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
