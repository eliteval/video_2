/*
 Navicat Premium Data Transfer

 Source Server         : mongo
 Source Server Type    : MongoDB
 Source Server Version : 40406
 Source Host           : localhost:27017
 Source Schema         : video

 Target Server Type    : MongoDB
 Target Server Version : 40406
 File Encoding         : 65001

 Date: 11/06/2021 21:24:11
*/


// ----------------------------
// Collection structure for admins
// ----------------------------
db.getCollection("admins").drop();
db.createCollection("admins");
db.getCollection("admins").createIndex({
    email: NumberInt("1")
}, {
    name: "email_1",
    background: true,
    unique: true
});
db.getCollection("admins").createIndex({
    firstName: NumberInt("1")
}, {
    name: "firstName_1",
    background: true
});
db.getCollection("admins").createIndex({
    lastName: NumberInt("1")
}, {
    name: "lastName_1",
    background: true
});
db.getCollection("admins").createIndex({
    phoneNumber: NumberInt("1")
}, {
    name: "phoneNumber_1",
    background: true,
    unique: true
});

// ----------------------------
// Documents of admins
// ----------------------------
db.getCollection("admins").insert([ {
    _id: ObjectId("60c08910a123c3218ce0b235"),
    firstName: "",
    lastName: "",
    permission: "pending",
    status: "active",
    image: "",
    connection: false,
    email: "topwolf0808@gmail.com",
    phoneNumber: "+8613124260482",
    password: "$2a$10$tGZjn68Z7yVBiQCmN0gnTuJKSmmWtsVO/rDMsPz4mUSHwAqPdv7IK",
    role: "SuperAdmin",
    createdAt: ISODate("2021-06-09T09:25:36Z"),
    updatedAt: ISODate("2021-06-09T09:25:36Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("admins").insert([ {
    _id: ObjectId("60c08910a123c3218ce0b236"),
    firstName: "",
    lastName: "",
    permission: "pending",
    status: "active",
    image: "",
    connection: false,
    email: "danieldelgado20g@gmail.com",
    phoneNumber: "+51955037779",
    password: "$2a$10$D68wz/6yVf8VWO8ielZcLe8KZ399hPLocBi3JsvEB4QvRK6bi/NUW",
    role: "SuperAdmin",
    createdAt: ISODate("2021-06-09T09:25:36Z"),
    updatedAt: ISODate("2021-06-09T09:25:36Z"),
    __v: NumberInt("0")
} ]);
db.getCollection("admins").insert([ {
    _id: ObjectId("60c08910a123c3218ce0b237"),
    firstName: "",
    lastName: "",
    permission: "pending",
    status: "active",
    image: "",
    connection: false,
    email: "adminadmin@gmail.com",
    phoneNumber: "+51955037770",
    password: "$2a$10$vBJIauaYAQE6u1.B4UyeF.vIY0HKYvX8zNsjeV2m4lggHxLm5pjLC",
    role: "Admin",
    createdAt: ISODate("2021-06-09T09:25:36Z"),
    updatedAt: ISODate("2021-06-09T09:25:36Z"),
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for patients
// ----------------------------
db.getCollection("patients").drop();
db.createCollection("patients");
db.getCollection("patients").createIndex({
    dni: NumberInt("1")
}, {
    name: "dni_1",
    background: true,
    unique: true
});
db.getCollection("patients").createIndex({
    email: NumberInt("1")
}, {
    name: "email_1",
    background: true,
    unique: true
});
db.getCollection("patients").createIndex({
    phoneNumber: NumberInt("1")
}, {
    name: "phoneNumber_1",
    background: true,
    unique: true
});

// ----------------------------
// Documents of patients
// ----------------------------

// ----------------------------
// Collection structure for refreshtokens
// ----------------------------
db.getCollection("refreshtokens").drop();
db.createCollection("refreshtokens");
db.getCollection("refreshtokens").createIndex({
    token: NumberInt("1")
}, {
    name: "token_1",
    background: true
});

// ----------------------------
// Documents of refreshtokens
// ----------------------------

// ----------------------------
// Collection structure for templates
// ----------------------------
db.getCollection("templates").drop();
db.createCollection("templates");

// ----------------------------
// Documents of templates
// ----------------------------
db.getCollection("templates").insert([ {
    _id: ObjectId("60c08802055800001b001be5"),
    name: "first",
    exampleVideo: "template_1.mp4",
    description: "This is a first template",
    level: "free",
    gamerVideo: {
        x: 0,
        y: 0,
        width: 1,
        height: 0.3
    },
    mainVideo: {
        width: 700,
        height: 1200
    }
} ]);
db.getCollection("templates").insert([ {
    _id: ObjectId("60c08806055800001b001be6"),
    name: "second",
    exampleVideo: "template_2.mp4",
    description: "This is a second template",
    level: "free",
    gamerVideo: {
        x: 0,
        y: 0,
        width: 1,
        height: 0.2
    },
    mainVideo: {
        width: 600,
        height: 1000
    }
} ]);
db.getCollection("templates").insert([ {
    _id: ObjectId("60c08830055800001b001be7"),
    name: "third",
    exampleVideo: "template_3.mp4",
    description: "This is a 3rd template",
    level: "premium",
    mainVideo: {
        width: 600,
        height: 1000
    }
} ]);

// ----------------------------
// Collection structure for users
// ----------------------------
db.getCollection("users").drop();
db.createCollection("users");
db.getCollection("users").createIndex({
    email: NumberInt("1")
}, {
    name: "email_1",
    background: true,
    unique: true
});
db.getCollection("users").createIndex({
    firstName: NumberInt("1")
}, {
    name: "firstName_1",
    background: true
});
db.getCollection("users").createIndex({
    lastName: NumberInt("1")
}, {
    name: "lastName_1",
    background: true
});
db.getCollection("users").createIndex({
    cmp: NumberInt("1")
}, {
    name: "cmp_1",
    background: true,
    unique: true
});
db.getCollection("users").createIndex({
    room: NumberInt("1")
}, {
    name: "room_1",
    background: true,
    unique: true
});
db.getCollection("users").createIndex({
    phoneNumber: NumberInt("1")
}, {
    name: "phoneNumber_1",
    background: true,
    unique: true
});

// ----------------------------
// Documents of users
// ----------------------------
