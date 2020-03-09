const db = require("./conn");

class AlbumModel {
  constructor(id, name_album, name_artist) {
    this.id = id;
    this.nameAlbum = name_album;
    this.nameArtist = name_artist;
  }

  static async getAllAlbums() {
    try {
      const response = await db.any(`SELECT * FROM albums;`);
      return response;
    } catch (error) {
      console.error("ERROR:", error);
      return error;
    }
  }

  static async getById(id) {
    try {
      const response = await db.any(`SELECT * FROM albums WHERE id = ${id} `);
      return response;
    } catch (error) {
      console.error("Error", error);
    }
  }

  static async addReview(users_id, r_id, review_title, review_text) {
    try {
      const response = await db.one(
        `INSERT INTO reviews (users_id, album_id, title, review, stars)
                VALUES ($1,$2,$3,$4,$5) RETURNING id`,
        [users_id, r_id, review_title, review_text, 5]
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log("Error:", error);
      return error;
    }
  }

  static async getAllReviewsByID(albumID) {
    // get all the reviews for a given restaurant given a specific restaurant id .
    try {
      const response = await db.any(
        `select albums.name_album , reviews.title , reviews.stars, reviews.review, users.first_name 
                from albums   inner join  reviews on albums.id = reviews.album_id 
                inner join users on users.id = reviews.users_id WHERE reviews.album_id = ${albumID}`
      );
      return response;
    } catch (error) {
      console.error("ERROR:", error);
      return error;
    }
  }
}

module.exports = AlbumModel;
