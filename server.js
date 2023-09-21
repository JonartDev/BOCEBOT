const puppeteer = require("puppeteer");
const express = require("express");
const yargs = require("yargs");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const fs = require("fs");
const { log } = require("console");
const url = fs.readFileSync("target.txt", "utf8");

const target = url.trim().split("\n");

const argv = yargs
  .option("srv", {
    alias: "n",
    describe: "Service",
    demandOption: true,
  })
  .help().argv;

const srv = argv.srv;
const currentTimestamp = Date.now();
const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString("en-US", {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
});
const formattedTime = currentDate.toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const filePath = "HTTP_RESULT/Speedtest"+currentTimestamp+".csv"; 
const filePath2 = "HIJACK_RESULT/Hijack"+currentTimestamp+".csv"; 
if (fs.existsSync(filePath)) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully.");
    }
  });
} else if (fs.existsSync(filePath2)) {
  fs.unlink(filePath2, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully.");
    }
  });
}

(async () => {
  let theadhijack = 0;
  let theadhttp = 0;
  for (let x = 0; x < target.length; x++) {
    var tableData = [];

    try {
      const browser = await puppeteer.launch({
        executablePath:
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        userDataDir: "%LOCALAPPDATA%GoogleChromeUser Data",
        headless: 'new',
        args: ["--no-sandbox"],
      });

      const page = await browser.newPage();

      await page.setViewport({
        width: 1920,
        height: 1080,
      });
      const logspeedtest = async (message) => {
        const page = await browser1.newPage();
        await page.goto("http://localhost:3000");
        const socketIoClientPath = require.resolve(
          "socket.io-client/dist/socket.io.js"
        );
        await page.addScriptTag({ path: socketIoClientPath });

        await page.evaluate((message) => {
          const socket = io("http://localhost:3000/"); 
          socket.emit("logspeedtest", message);
          console.log(message);
        }, message);

      };
      const loghijack = async (message) => {
        const page = await browser1.newPage();
        await page.goto("http://localhost:3000");
        const socketIoClientPath = require.resolve(
          "socket.io-client/dist/socket.io.js"
        );
        await page.addScriptTag({ path: socketIoClientPath });

        await page.evaluate((message) => {
          const socket = io("http://localhost:3000/"); 
          socket.emit("loghijack", message);
          console.log(message);
        }, message);

      };
      const log = async (message) => {
        const page = await browser.newPage();

        await page.goto("http://localhost:3000");

        const socketIoClientPath = require.resolve(
          "socket.io-client/dist/socket.io.js"
        );
        await page.addScriptTag({ path: socketIoClientPath });

        await page.evaluate((message) => {
          const currentDate = new Date();
          const formattedDate = currentDate.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          });
          const formattedTime = currentDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          const socket = io("http://localhost:3000/"); 
          socket.emit(
            "log",
            "[" + formattedDate + " " + formattedTime + "] " + message
          );
          console.log(
            "[" + formattedDate + " " + formattedTime + "] " + message
          );
        }, message);
      };

      if (srv == "http") {
        if (theadhttp == 0) {

          tableData.push(["Host", "检测点", "状态"]);
          theadhttp = 1;
        }
      }
      if (srv == "hijack") {
        if (theadhijack == 0) {

          tableData.push([
            "网址",
            "作用",
            "被屏蔽的检测点",
            "屏蔽数量",
            "状态非200",
            "劫持数量",
            "劫持地区/域名",
            "劫持链接",
          ]);
          theadhijack = 1;
        }
      }

      await log(
        "==============================================================="
      );
      await log("Checking " + target[x]);
      await page.goto("https://www.boce.com/" + srv + "/" + target[x]);

      let pendingPostRequests = 0;
      await log("Obtaining results...");
      await log("Processing data...");

      await log("Please Wait...");

      while (true) {
        try {
          const responses = await page.waitForResponse(
            (response) => response.request().method() === "POST",
            {
              timeout: 15000,
            }
          );

          pendingPostRequests--;
          if (
            responses.url() === "https://www.boce.com/apiHtml/oauth/checkLogin"
          ) {
            await log("Please login your account first.");
            await log("After logged in, Please run the bot again");
            await browser.close();
            const browser1 = await puppeteer.launch({
              executablePath:
                "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
              userDataDir: "%LOCALAPPDATA%GoogleChromeUser Data",
              headless: false,

              args: ["--no-sandbox"],
            });
            const page1 = await browser1.newPage();
            await page1.setViewport({
              width: 1920,
              height: 1080,
            });

            await page1.goto("https://www.boce.com");
            await page1.waitForSelector(".goLogin");

            await page1.click(".goLogin");

            return;
          } else {
            await log("Obtaining results....");
          }

          if (pendingPostRequests === 0) {
            await log("No more pending POST requests.");

            console.log("No more pending POST requests.");
            break;
          }
        } catch (error) {
          if (error.name === "TimeoutError") {
            await log("Results Fetch Successfully!");

            break;
          } else {
            await log("An error occurred: " + error);
            break;
          }
        }
      }

      const rows = await page.$$(".table_cont tr");

      let zerocount = 0;
      let dcountnotequalto = 0;
      let bcountblank = 0;
      let bcounthomeurl = 0;
      let ecounturl = 0;
      let elisturl = [];
      let firstcolall = "";
      let eightcolall = "";

      let datarow = [];
      let get_columnA = [];
      let equalsto异常andurl = [];
      let rowfortabledata = [];

      for (const row of rows) {
        let datacell = [];
        let get_columnAset = [];
        const cells = await row.$$("td");

        let cellCountForRow = 0; 

        for (const cell of cells) {
          const cellText = await cell.evaluate((el) => el.textContent);
          const cleanedText = cellText.trim().replace(/\n/g, " ");
          datacell.push(cleanedText);

          if (srv.includes("http")) {
            if (
              (cellCountForRow === 3 && cleanedText.trim() === "000") ||
              cleanedText.trim() === "00" ||
              (cleanedText.trim() === "0" && cleanedText.trim() != "200")
            ) {

              zerocount++;
            }
          }
          if (srv === "hijack") {

            if (cellCountForRow === 1 && cleanedText.trim() === "") {

              bcountblank++;
            }

            if (cellCountForRow === 1 && cleanedText.trim() === "127.0.0.1") {

              bcounthomeurl++;
            }
          }

          if (cellCountForRow >= cells.length) {
            cellCountForRow = 0;
          } else {
            cellCountForRow++;
          }
        }

        if (srv === "hijack") {

          const searchString正常 = "正常";
          const searchString异常 = "异常";
          const foundElement正常 = datacell.find(
            (item) => item === searchString正常
          );
          const foundElement异常 = datacell.find(
            (item) => item === searchString异常
          );

          if (!foundElement正常) {
            if (datacell[0] !== undefined) {
              if (datacell[0] !== "") {
                get_columnAset.push(datacell[0]);
                console.log("get_columnAset.push(datacell[0]);:", datacell[0]);
              }
            }
          }

          if (foundElement异常) {
            if (datacell[4].includes("https") || datacell[4].includes("http")) {

              equalsto异常andurl.push(datacell[4]);

              ecounturl++;

            }
          }
          if (get_columnAset) {
            get_columnA.push(get_columnAset);

          }

          datarow.push(datacell);
        }

      }

      console.log(
        "tableData:",
        bcountblank,
        bcounthomeurl,
        ecounturl,
        equalsto异常andurl
      );

      var ftarget = target[x].replace(/^\s+|\s+$/g, "");

      if (srv == "http") {
        if (zerocount >= 1 && zerocount <= 4) {
          tableData.push(["\n" + ftarget, zerocount, "正常"]);

        } else if (zerocount >= 5 && zerocount <= 9) {
          tableData.push(["\n" + ftarget, zerocount, "小面积"]);

        } else if (zerocount >= 10) {
          tableData.push(["\n" + ftarget, zerocount, "大面积"]);

        }
      }
      if (srv == "hijack") {

        console.log(
          "tableData:",
          bcountblank,
          bcounthomeurl,
          ecounturl,
          get_columnA,
          equalsto异常andurl
        );

        const get_columnAstring = get_columnA
          .join(",")
          .replace(/\s+/g, " ")
          .replace(/,/g, " ");
        const equalsto异常andurlstring = equalsto异常andurl.join(", ");
        const stringWithoutLongSpaces = get_columnAstring.replace(/\s+/g, " ");

        tableData.push(
          "\n" + target[x].replace(/[\r\n]+/g, ""),
          "-",
          stringWithoutLongSpaces,
          bcountblank,
          bcounthomeurl,
          ecounturl,
          stringWithoutLongSpaces,
          equalsto异常andurlstring
        );

        get_columnA = [];
        bcountblank = 0;
        bcounthomeurl = 0;
        ecounturl = 0;
        equalsto异常andurl = [];
      }
      const csvString = (value) => {
        if (typeof value === "string" && value.includes(",")) {
          return `"${value}"`; 
        }
        return value;
      };
      let csv = tableData.map(csvString).join(",");

      if (srv == "http") {
        const folderPath = "HTTP_RESULT";

        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
          await log("Folder created:" + folderPath);
        }
        if (!fs.existsSync("HTTP_RESULT/Speedtest"+currentTimestamp+".csv")) {
          fs.writeFileSync("HTTP_RESULT/Speedtest"+currentTimestamp+".csv", csv);
        } else {
          fs.appendFileSync("HTTP_RESULT/Speedtest"+currentTimestamp+".csv", csv);
        }

        await log("File Updated: " + "HTTP_RESULT/Speedtest"+currentTimestamp+".csv");
      } else if (srv == "hijack") {
        const folderPath2 = "HIJACK_RESULT";
        if (!fs.existsSync(folderPath2)) {
          fs.mkdirSync(folderPath2, { recursive: true });
          await log("Folder created:" + folderPath2);
        }
        if (!fs.existsSync("HIJACK_RESULT/Hijack"+currentTimestamp+".csv")) {
          fs.writeFileSync("HIJACK_RESULT/Hijack"+currentTimestamp+".csv", csv);
        } else {
          fs.appendFileSync("HIJACK_RESULT/Hijack"+currentTimestamp+".csv", csv);
        }
        await log("File Updated: " + "HIJACK_RESULT/Hijack"+currentTimestamp+".csv");
      }

      await browser.close();
    } catch (error) {
      console.error("An error occurred:", error);
    }

    tableData = "";
    await log("Scanning Complete!");

  }
})();

