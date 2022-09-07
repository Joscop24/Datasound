/*
    Forum Controlleur
*/

// Import Module
// const { MODE } = process.env
require("dotenv").config();


//PING POUR TEST UNITAIRE
exports.getPing = (req, res) => {
  const data = {
    name: "pong !"
  }
  console.log('Controller ping')
  if (process.env.MODE === "test") {
    res.json({ data })
  } else {
    res.render("home", { data })
  }
}


// Page Forum
exports.getPageForum = async (req, res) => {
  let data;
  
  data = await db.query(`SELECT * FROM user INNER JOIN comments ON user.id = comments.id_user`)
  console.log('infoData' , data);
  
  // TEST UNITAIRE OU VRAI CODE
  if (process.env.MODE === "test") {
    res.json({ data })
  } else {
    res.render("forum", {
      db: data
    })
  }
}



// Envoi du commentaire
exports.sendComment = async (req, res) => {
  const { commentary } = req.body;
  const image = req.file ? req.file.filename : false;
  console.log("image", req.file);
  let data;

  if (image)
    data = await db.query(`INSERT INTO comments SET commentary="${commentary}", id_user="${req.session.user.id}" , image="${image}"`)
  else
    data = await db.query(`INSERT INTO comments SET commentary="${commentary}", id_user="${req.session.user.id}" , image=''`)

  // TEST UNITAIRE OU VRAI CODE
  console.log(data);
  if (process.env.MODE === "test") {
    res.json({ data })
  } else {
    console.log("envoi du controller OK");
    res.redirect("back");
  }
}

// Modification du Commentaire
exports.editComment = async (req, res) => {
  const { id_comments } = req.params;
  const { newcommentary } = req.body;
  let data;

  data = await db.query(`UPDATE comments SET commentary="${newcommentary}" WHERE id_comments=${id_comments};`)

  // TEST UNITAIRE OU VRAI CODE
  if (process.env.MODE === "test") {
    res.json({ data })
  } else {
    res.redirect("back"), { db: data }
  }
}



// Suppression du commentaire
exports.deleteComment = async (req, res) => {
  const { id_comments } = req.params;

  const data = await db.query(`DELETE FROM comments WHERE id_comments=${id_comments}`)

  if (process.env.MODE === "test") {
    res.json({ data })
  } else {
    res.redirect("/forum");
  }
}