import fs from "fs";
import jsonServer from "json-server";
import jwt from "jsonwebtoken";
const server = jsonServer.create();
const router = jsonServer.router({});
const middlewares = jsonServer.defaults();
const secretKey = "mySecretKey";
server.use(middlewares);
server.use(jsonServer.bodyParser);
import usersData from "../datas/users.json" assert { type: "json" };
import menusData from "../datas/menus.json" assert { type: "json" };
import noticesData from "../datas/notices.json" assert { type: "json" };
import roadData from "../datas/roadInfo.json" assert { type: "json" };
//一、用户
//1、注册接口
server.post("/api/register", (req, res) => {
  const { username, password, type } = req.body;
  const maxId = Math.max(...usersData.users.map((item) => item.id));
  const existingUser = usersData.users.find((u) => u.username === username);
  if (existingUser) {
    res.status(200).jsonp({
      code: 400,
      msg: "用户名重复，请重新注册",
    });
  } else {
    const newUser = {
      id: maxId >= 1 ? maxId + 1 : 1,
      username,
      password,
      type,
      isOnline: false,
    };
    usersData.users.push(newUser);
    res.status(200).jsonp({
      code: 200,
      msg: "注册成功",
    });
    // 将修改后的数据写入回 users.json 文件
    fs.writeFile(
      "../datas/users.json",
      JSON.stringify(usersData, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return;
        }
        console.log("users.json file has been updated");
      }
    );
  }
});
//2、登录接口
server.post("/api/login", (req, res) => {
  const { username, password, type } = req.body;
  const user = usersData.users.find(
    (u) => u.username === username && u.password === password && u.type === type
    //  && u.isOnline === false //确保已经登录过的不能再登录
  );
  if (user) {
    user.isOnline = true;
    const token = jwt.sign({ username: user.username, id: user.id }, secretKey);
    res.status(200).jsonp({
      code: 200,
      msg: "登陆成功",
      token,
    });
  } else {
    res.status(200).jsonp({
      code: 400,
      msg: "用户名或密码错误，登录失败",
    });
  }
});
//3、查询不同类型用户
server.get("/api/users", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // 获取请求头中的JWT令牌
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(200).json({
        code: 401,
        error: "Invalid token",
      });
    } else {
      const { type } = req.query;
      const user = usersData.users.find((u) => u.type === type);
      res.status(200).jsonp({
        code: 200,
        msg: "success",
        data: user,
      });
    }
  });
});

//4、退出登录
server.post("/api/logout", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // 获取请求头中的JWT令牌
  jwt.verify(token, secretKey, (err, decoded) => {
    const { username, type } = req.body;
    const user = usersData.users.find(
      (u) => u.username === username && u.type === type
    );
    user.isOnline = false;
    res.status(200).jsonp({
      code: 200,
      msg: "登出成功",
    });
    // 将修改后的数据写入回 users.json 文件
    fs.writeFile(
      "../datas/users.json",
      JSON.stringify(usersData, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return;
        }
        console.log("users.json file has been updated");
      }
    );
  });
});
//5、删除用户
server.delete("/api/users/delete", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // 获取请求头中的JWT令牌
  jwt.verify(token, secretKey, (err, decoded) => {
    const { username, type } = req.body;
    const userIndex = usersData.users.findIndex(
      (u) => u.username === username && u.type === type
    );
    if (userIndex !== -1) {
      usersData.users.splice(userIndex, 1);
      res.status(200).jsonp({
        code: 200,
        msg: "删除成功",
      });
      // 将修改后的数据写入回 users.json 文件
      fs.writeFile(
        "../datas/users.json",
        JSON.stringify(usersData, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error("Error writing file:", err);
            return;
          }
          console.log("users.json file has been updated");
        }
      );
    } else {
      res.status(200).jsonp({
        code: 404,
        msg: "删除失败",
      });
    }
  });
});
//6、修改密码
server.put("/api/users/update", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // 获取请求头中的JWT令牌
  jwt.verify(token, secretKey, (err, decoded) => {
    const { username, newPassword, type } = req.body;
    const userIndex = usersData.users.findIndex(
      (u) => u.username === username && u.type === type
    );
    if (userIndex !== -1) {
      usersData.users[userIndex].password = newPassword;
      res.status(200).jsonp({
        code: 200,
        msg: "修改密码成功",
      });
      // 将修改后的数据写入回 users.json 文件
      fs.writeFile(
        "../datas/users.json",
        JSON.stringify(usersData, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error("Error writing file:", err);
            return;
          }
          console.log("users.json file has been updated");
        }
      );
    } else {
      res.status(200).jsonp({
        code: 400,
        msg: "修改密码失败",
      });
    }
  });
});
//补充
// 7、查询所有用户
server.get("/api/allusers", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // 获取请求头中的JWT令牌
  jwt.verify(token, secretKey, (err, decoded) => {
    const { type } = req.body;
    res.status(200).jsonp({
      code: 200,
      msg: "查询成功",
      data: usersData.users,
    });
  });
});
//二、获取菜单
server.get("/api/menu", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // 获取请求头中的JWT令牌
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(200).json({
        code: 401,
        error: "Invalid token",
      });
    } else {
      const type = req.query.type;
      const key = Object.keys(menusData.menus).find((key) => key == type);
      const menu = menusData.menus[key];
      res.status(200).jsonp({
        code: 200,
        msg: "success",
        data: menu,
      });
    }
  });
});

//三、公告
// 3.1 发布公告
server.post("/api/publish", (req, res) => {
  const { publisher, type, title, content, date } = req.body;
  // 查找最大id
  const maxId = Math.max(...noticesData.notices.map((item) => item.id));
  const newNotice = {
    id: maxId >= 1 ? maxId + 1 : 1,
    publisher,
    type,
    title,
    content,
    date,
  };
  noticesData.notices.push(newNotice);
  res.status(200).jsonp({
    code: 200,
    msg: "发布成功",
  });
  // 将修改后的数据写入回 notices.json 文件
  fs.writeFile(
    "../datas/notices.json",
    JSON.stringify(noticesData, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("notices.json file has been updated");
    }
  );
});

// 3.2 获取所有公告
server.get("/api/notice", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // 获取请求头中的JWT令牌
  jwt.verify(token, secretKey, (err, decoded) => {
    res.status(200).jsonp({
      code: 200,
      msg: "查询成功",
      data: noticesData.notices,
    });
  });
});

// 3.3 根据id查询公告
server.get("/api/noticeDetails", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // 获取请求头中的JWT令牌
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(200).json({
        code: 401,
        error: "Invalid token",
      });
    } else {
      const { id } = req.query;
      const notice = noticesData.notices.find((u) => u.id == id);
      res.status(200).jsonp({
        code: 200,
        msg: "success",
        data: notice,
      });
    }
  });
});

// 3.4 删除公告
server.delete("/api/notice/delete", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // 获取请求头中的JWT令牌
  jwt.verify(token, secretKey, (err, decoded) => {
    const { id } = req.body;
    const noticeIndex = noticesData.notices.findIndex((u) => u.id === id);
    if (noticeIndex !== -1) {
      noticesData.notices.splice(noticeIndex, 1);
      res.status(200).jsonp({
        code: 200,
        msg: "删除成功",
      });
      // 将修改后的数据写入回 notices.json 文件
      fs.writeFile(
        "../datas/notices.json",
        JSON.stringify(noticesData, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error("Error writing file:", err);
            return;
          }
          console.log("notices.json file has been updated");
        }
      );
    } else {
      res.status(200).jsonp({
        code: 404,
        msg: "删除失败",
      });
    }
  });
});

// 四：路况
// 上报路况
server.post("/api/reportRoad", (req, res) => {
  const { reporter, type, location, sign, time, detail } = req.body;
  // 查找最大id
  const maxId = Math.max(...roadData.roads.map((item) => item.id));
  const newRoad = {
    id: maxId >= 1 ? maxId + 1 : 1,
    reporter,
    type,
    location,
    sign,
    time,
    detail,
    isHandle: false,
  };
  roadData.roads.push(newRoad);
  res.status(200).jsonp({
    code: 200,
    msg: "上报成功",
  });
  // 将修改后的数据写入回 roadInfo.json 文件
  fs.writeFile(
    "../datas/roadInfo.json",
    JSON.stringify(roadData, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("roadInfo.json file has been updated");
    }
  );
});

// 获取所有路况
server.get("/api/roadInfo", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // 获取请求头中的JWT令牌
  jwt.verify(token, secretKey, (err, decoded) => {
    res.status(200).jsonp({
      code: 200,
      msg: "查询成功",
      data: roadData.roads,
    });
  });
});

// 修改路况信息
server.patch("/api/roadInfo/update", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // 获取请求头中的JWT令牌
  jwt.verify(token, secretKey, (err, decoded) => {
    const { id } = req.body;
    console.log(id);
    const roadIndex = roadData.roads.findIndex((u) => u.id === id);
    if (roadIndex !== -1) {
      // 修改处理状态为true
      roadData.roads[roadIndex].isHandle = true;
      res.status(200).jsonp({
        code: 200,
        msg: "更新成功",
      });
      // 将修改后的数据写入回 roads.json 文件
      fs.writeFile(
        "../datas/roadInfo.json",
        JSON.stringify(roadData, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error("Error writing file:", err);
            return;
          }
          console.log("roadInfo.json file has been updated");
        }
      );
    } else {
      res.status(404).jsonp({
        code: 400,
        msg: "更新失败",
      });
    }
  });
});

// 删除路况信息
server.delete("/api/roadInfo/delete", (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // 获取请求头中的JWT令牌
  jwt.verify(token, secretKey, (err, decoded) => {
    const { id } = req.body;
    const roadIndex = roadData.roads.findIndex((u) => u.id === id);
    if (roadIndex !== -1) {
      roadData.roads.splice(roadIndex, 1);
      res.status(200).jsonp({
        code: 200,
        msg: "删除成功",
      });
      // 将修改后的数据写入回 users.json 文件
      fs.writeFile(
        "../datas/roadInfo.json",
        JSON.stringify(roadData, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error("Error writing file:", err);
            return;
          }
          console.log("roadInfo.json file has been updated");
        }
      );
    } else {
      res.status(200).jsonp({
        code: 404,
        msg: "删除失败",
      });
    }
  });
});

router.db.setState(usersData);

server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});

// // 生成当前时间
// const initTime = () => {
//   const date = new Date();
//   let year = date.getFullYear();
//   let month = date.getMonth() + 1;
//   let day = date.getDate();
//   let hour = date.getHours();
//   let minute = date.getMinutes();
//   let second = date.getSeconds();
//   return `${year}-${month}-${day}`;
// };
