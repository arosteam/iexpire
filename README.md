<div align="center">
  <p>
 <a href="https://www.npmjs.com/package/iexpire"><img  src="https://github.com/4i8/iexpire/blob/master/logo/iexpire.png" width="400" alt="iexpire" /></a>
  </p>
  <p>
 <a href="https://github.com/arosteam"><img src="https://img.shields.io/static/v1?label=powered%20by&message=Aros&color=000636&style=for-the-badge&logo=Windows%20Terminal&logoColor=fff"/></a>
 <a href="https://www.npmjs.com/package/iexpire"><img src="https://img.shields.io/npm/v/iexpire.svg?style=for-the-badge" alt="NPM version" /></a>
 <a href="https://www.npmjs.com/package/iexpire"><img src="https://img.shields.io/npm/dt/iexpire.svg?maxAge=3600&style=for-the-badge" alt="NPM downloads" /></a>
     <a href="https://www.npmjs.com/package/iexpire"><img src="https://img.shields.io/badge/-donate-blue.svg?logo=paypal&style=for-the-badge" alt="NPM downloads" /></a>

  </p>
  
</div>

# **About**

Adding an expiration period in the form of a count and you can also update the duration in your model and here it will automatically synchronize the new period
And when this period expires, the event will be issued, this package currently supports these database systems.
MongoDB
How this package works: You will create a connection to the model with data that you want to create for an expiration period, and note that the package only supports milliseconds
Then it will create a dummy container within the process that has a duration for each object, and it will subtract the period that you put within the [option](#options) every time the session of the intervel period that you put into the [option](#options) ends.

I do not know my explanation is understandable or not, but this package you run only once on the model you want to create an expiration period and you do not need to create a new one every time
use [Example Test](#example) to see How does this package work

- Easy to use

# **Alert**

property "\_id" must be included in the data because we use it as the container key

# **Installation**

```sh-session
npm install iexpire
yarn add iexpire
```

# **How to use**

```js
const { MongoDbExpirer } = require("iexpire");
const iexpire = new MongoDbExpirer(<Modal>, {
<Options>
});
```

# **Options**

```js
{
  subtract: "",// He will subtract this period and then update it each time
  interval: "",//Here the Interval, when the period ends, it will subtract the number
  property: "",// property for expiration that will be updated
  delete: false,// If true, it will delete the document when the period ends
  sync: "2s",//Here it checks if there is new data with a new id, and if it finds new data, it will create a new container for it with a different expiration period
}
```

# **Example**

### **Example Test**

```js
const mongoose = require("mongoose");
const ms = require("ms");
mongoose.connect("<UrI>").then(async () => {
  const { MongoDbExpirer } = require("iexpire");
  const mongoose = require("mongoose");
  //Modal is the model that you want to create an expiration period
  const Schema = new mongoose.Schema({
    expiresAt: Number, //milliseconds
  });
  const Modal = mongoose.model("subscriptions", Schema); //Your model
  const iexpire = new MongoDbExpirer(Modal, {
    subtract: "1d",
    interval: "1s", //This is just an example. If the expiration period is in days, it is preferable to put it "1d" instead of "1s"
    property: "expiresAt",
    delete: true, // If true, it will delete the document when the period ends
    sync: "2s",
  });
  //This event if you get an error
  iexpire.on("error", (data) => {
    console.log(data);
  });
  //The data from which it was subtracted
  iexpire.on("subtract", (data) => {
    console.log(data);
  });
  //Here is the data that was deleted
  iexpire.on("delete", (data) => {
    console.log(data);
  });
  //And here it is when it expires
  iexpire.on("end", (data) => {
    console.log(data);
  });
  console.log("Connect To MongoDB Successfully");
  //There is no need to use this if you are taking the process seriously {This is just an example}
  Modal.create({
    expiresAt: ms("30d"),
  });
  //
});
```

### **Example Seriously**

```js
const mongoose = require("mongoose");
const ms = require("ms");
mongoose.connect("<UrI>").then(async () => {
  const { MongoDbExpirer } = require("iexpire");
  const mongoose = require("mongoose");
  //Modal is the model that you want to create an expiration period
  const Schema = new mongoose.Schema({
    expiresAt: Number,//milliseconds
  });
  const Modal = mongoose.model("subscriptions", Schema); //Your model
  const iexpire = new MongoDbExpirer(Modal, {
    subtract: "1d",
    interval: "1d",
    property: "expiresAt",
    delete: true, // If true, it will delete the document when the period ends
    sync: "2s",
  });
  //This event if you get an error
  iexpire.on("error", (data) => {
    console.log(data);
  });
  //The data from which it was subtracted
  iexpire.on("subtract", (data) => {
    console.log(data);
  });
  //Here is the data that was deleted
  iexpire.on("delete", (data) => {
    console.log(data);
  });
  //And here it is when it expires
  iexpire.on("end", (data) => {
    console.log(data);
  });
  console.log("Connect To MongoDB Successfully");
  });
```

## Links

- [Twiter](https://twitter.com/onlyarth)
- [Github](https://github.com/4i8)

## License

- [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)
