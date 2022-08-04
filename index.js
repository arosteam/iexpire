const ms = require("ms");
const interval = require("set-interval");
const events = require("events");
const EventEmitter = new events();
EventEmitter.setMaxListeners(0);
/**
 *
 * @param {*} options
 * @returns {MongoDbExpirer, EventEmitter}
 * @constructor
 */
function MongoDbExpirer(
  connection,
  options = {
    subtract: "",
    interval: "",
    property: "",
    delete: false,
    sync: "2s",
  }
) {
  options.subtract = ms(options.subtract);
  options.interval = ms(options.interval);
  if (!connection) {
    throw new Error("Modal is required");
  }
  setInterval(() => {
    connection
      .find()
      .then((FIND_DATA) => {
        FIND_DATA.forEach((RE_DATA) => {
          if (
            !interval.key[RE_DATA._id] &&
            RE_DATA[options.property] &&
            !isNaN(Number(RE_DATA[options.property])) &&
            (typeof RE_DATA[options.property] === "string" ||
              typeof RE_DATA[options.property] === "number")
          ) {
            interval.start(
              () => {
                connection
                  .findById(RE_DATA._id)
                  .then(async (res) => {
                    if (!res) return interval.clear(RE_DATA._id);
                    if (
                      !res[options.property] ||
                      isNaN(Number(res[options.property])) ||
                      (typeof res[options.property] !== "string" &&
                        typeof res[options.property] !== "number")
                    ) {
                      interval.clear(RE_DATA._id);
                      EventEmitter.emit(
                        "error",
                        Object.assign({}, RE_DATA.toObject(), {
                          Error: new Error("Property is not defined"),
                        })
                      );
                      return;
                    }
                    const subtract = res[options.property] - options.subtract;
                    await connection
                      .updateOne(
                        { _id: res._id },
                        { $set: { [options.property]: subtract } }
                      )
                      .catch((err) => {
                        EventEmitter.emit("error", err);
                      });
                    EventEmitter.emit(
                      "subtract",
                      Object.assign(RE_DATA.toObject(), {
                        old: res[options.property],
                        new: subtract,
                        EventTypeIEXPIRE: "subtract",
                      })
                    );
                    if (subtract <= 0) {
                      if (options.delete) {
                        connection
                          .deleteOne({ _id: res._id })
                          .then(() => {
                            EventEmitter.emit(
                              "delete",
                              Object.assign(RE_DATA.toObject(), {
                                EventTypeIEXPIRE: "delete",
                              })
                            );
                          })
                          .catch((err) => {
                            EventEmitter.emit("error", err);
                          });
                      }
                      EventEmitter.emit(
                        "end",
                        Object.assign(RE_DATA.toObject(), {
                          EventTypeIEXPIRE: "end",
                        })
                      );
                      interval.clear(res._id);
                    }
                  })
                  .catch((err) => {
                    EventEmitter.emit("error", err);
                  });
              },
              options.interval,
              RE_DATA._id
            );
          }
        });
      })
      .catch((err) => {
        EventEmitter.emit("error", err);
        throw err;
      });
  }, ms(options.sync));
  return EventEmitter;
}
module.exports = {
  MongoDbExpirer,
};
/**
 * @Copyright 2022 Arth(https://github.com/4i8/)
 */
