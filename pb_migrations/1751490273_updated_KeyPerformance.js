/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1025686238")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number3406851003",
    "max": null,
    "min": null,
    "name": "correct",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1025686238")

  // remove field
  collection.fields.removeById("number3406851003")

  return app.save(collection)
})
