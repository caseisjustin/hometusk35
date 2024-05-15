import { Router } from "express";
import { register, login, addBook, allBookData, getBookById, updateBook, deleteBook, addComment, getComments, addPhoto, getPhotos } from "../controllers/main.controller.js"

const router = Router();

// USERS
router.post("/users/register", register)
router.post("/users/login", login)
// ========================================


// BOOKS
router.post("/books", addBook)
router.get("/books", allBookData)
router.get("/books/:id", getBookById)
router.put("/books/:id", updateBook)
router.delete("/books/:id", deleteBook)
// ========================================


// COMMENTS
router.post("/books/:id/comments", addComment)
router.get("/books/:id/comments", getComments)


// PHOTOS
router.post("/books/:id/photos", addPhoto)
router.get("/books/:id/photos", getPhotos)


// BLOGS

export default router;