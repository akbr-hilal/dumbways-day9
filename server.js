const express = require("express");
const app = express();
const port = 5000;

const db = require("./connections/db");

app.set("view engine", "hbs"); //Set hbs
app.use("/assets", express.static(__dirname + "/assets"));
app.use(express.urlencoded({ extended: false }));

let isLogin = true;

app.get("/", function (req, res) {
    db.connect(function (err, client, done) {
        if (err) throw err;

        client.query("SELECT * FROM tb_project", function (err, result) {
            if (err) throw err;

            let data = result.rows;

            let dataProject = data.map(function (items) {
                return {
                    ...items,
                    start_date: getFullTime(items.start_date),
                    end_date: getFullTime(items.end_date),
                    duration: getDistanceTime(
                        new Date(items.start_date),
                        new Date(items.end_date)
                    ),
                    isLogin,
                };
            });
            console.log(dataProject);
            res.render("index", { isLogin, projects: dataProject });
        });
    });
});

app.get("/del-project/:index", function (req, res) {
    let index = req.params.index;
    dataProject.splice(index, 1);

    res.redirect("/");
});

app.get("/edit-project/:index", function (req, res) {
    let index = req.params.index;
    console.log(index);

    let edit = dataProject[index];
    console.log(edit);

    res.render("edit-project", { isLogin: isLogin, edit, name: index });
});
app.post("/edit-project/:index", function (req, res) {
    let data = req.body;
    let index = req.params.index;

    data = {
        title: data.titleProject,
        startDate: getFullTime(new Date(data.startDateProject)),
        endDate: getFullTime(new Date(data.endDateProject)),
        description: data.descriptionProject,
        nodeJs: data.checkNodeJS,
        reactJs: data.checkReactJS,
        angular: data.checkAngularJS,
        laravel: data.checkLaravel,
        image: data.imageProject,
        duration: getDistanceTime(
            new Date(data.startDateProject),
            new Date(data.endDateProject)
        ),
    };

    dataProject[index] = data;
    res.redirect("/");
});

app.get("/add-project", function (req, res) {
    res.render("add-project");
});

app.post("/add-project", function (req, res) {
    console.log(req.body);

    db.connect(function (err, client, done) {
        if (err) throw err;

        const insertSql = `INSERT INTO tb_project(title, start_date, end_date, description, technologis, image) VALUES ('${req.body.titleProject}', '${req.body.startDateProject}', '${req.body.endDateProject}', ''${req.body.descriptionProject}, '${req.body.technologisProject}', '${req.body.imageProject}')`;

        client.query(insertSql, function (err, result) {
            if (err) throw err;
            console.log(err, result);
            res.redirect("/");
        });
    });
});

app.get("/project-detail/:index", function (req, res) {
    let index = req.params.index;
    console.log(index);

    let project = dataProject[index];

    console.log(project);
    res.render("project-detail", project);
});

app.get("/contact", function (req, res) {
    res.render("contact");
});

function getFullTime(waktu) {
    let month = [
        "Januari",
        "Febuari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    let date = waktu.getDate();
    let monthIndex = waktu.getMonth();
    let year = waktu.getFullYear();

    let fullTime = `${date} ${month[monthIndex]} ${year}`;
    return fullTime;
}

function getDistanceTime(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    let getTime = end - start;

    let distanceDay = Math.floor(getTime / (1000 * 3600 * 24));
    let distanceMonth = Math.floor(distanceDay / 31);

    duration =
        distanceMonth <= 0 ? distanceDay + " Hari" : distanceMonth + " Bulan";

    if (start > end) {
        alert("Error Your Date");
    } else if (start < end) {
        return `${duration}`;
    }
}

app.listen(port, function (req, res) {
    console.log(`Server berjalan di port ${port}`);
});
