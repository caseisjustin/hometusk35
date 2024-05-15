import { compareSync } from "bcrypt"
import { query } from "../utils/db.js"
import { genDate, hashFunc, compareFunc } from "../utils/pass.checker.js"



// USERS===========================================
// USER REGISTR
export const register = async (req, res) =>{
    try {
        const {username, email, password} = await req.body[0]
        let ucheck = await query(`SELECT * FROM users WHERE name = $1`, [username])
        let echeck = await query(`SELECT * FROM users WHERE email = $1`, [email])
        if(ucheck.rows.length != 0){
            res.send(`User with name ${username} already exists`)
        }
        else if(echeck.rows.length != 0){
            res.send(`User with email ${email} already exists`)
        }
        else{
            let pass = hashFunc(password)
            await query("INSERT INTO users(name, email, password, created_at) VALUES($1, $2, $3, $4)", [username, email, pass, genDate()])
            res.status(200).send("Registration success")
        }
    } catch (err) {
        res.status(500).send("Some error occured")
    }
}

// USER LOGIN
export const login = async (req, res) =>{
    try{
        const {email, password} = req.body[0]
        let data = await query(`SELECT * FROM users WHERE email = $1`, [email])
        let pass = compareFunc(password, data.rows[0].password)
        if(data.rows.length != 0 && pass){
            res.status(200).send("SUCCESS loged in")
        }
        else{
            res.send("No such user")
        }
    }catch(err){
        res.send("An error reading data")
    }
}
// =====================================================




// BOOKS================================================
export const addBook = async (req, res) => {
    try {
        let {title, author, genre} = req.body[0]
        let tcheck = await query(`SELECT * FROM books WHERE title = $1`, [title])

        const {email, password} = req.body[0]
        let data = await query(`SELECT * FROM users WHERE email = $1`, [email])
        let pass = compareFunc(password, data.rows[0].password)

        if(tcheck.rows.length != 0){
            res.send("This book already exists")
        }
        else{
            if(title && author && genre){
                username = await query(`SELECT id FROM users WHERE email = $1`, [email])
                if(username.rows.length == 0){
                    res.status(400).send("No user found with provided email")
                }
                else{
                    await query(`INSERT INTO books(title, author, publication_date, genre, user_id) VALUES($1, $2, $3, $4, $5)`, [title, author, genDate(), genre, username.rows[0].id])
                    res.send("added")
                }
            }
        }
    } catch (err) {
        res.send(`${err}`)
    }
}

// GET ALL BOOKS
export const allBookData = async (req, res) => {
    try {
        const {email, password} = req.body[0]
        let data = await query(`SELECT * FROM users WHERE email = $1`, [email])
        let pass = compareFunc(password, data.rows[0].password)
        if(pass){
            let result = await query(`SELECT * FROM books`)
            res.send(result.rows)
        }
        else
            res.sedn("Couldn't log in")
    } catch (err) {
        res.send("Couldn't read data from database")
    }
}

// GET BOOK BY ID
export const getBookById = async (req, res) => {
    try {
        const {email, password} = req.body[0]
        let data = await query(`SELECT * FROM users WHERE email = $1`, [email])
        let pass = compareFunc(password, data.rows[0].password)
        if(pass){
            let id = req.params.id
            let result = await query(`SELECT * FROM books WHERE id = $1`, [id])
            if(result.rows.length == 0){
                res.send(`No book with id ${id}`)
            }
            else
                res.send(result.rows)
        }
        else{
            res.send("Couldn't log in")
        }
    } catch (err) {
        res.send("Error while getting data from DB")
    }
}

// PUT BOOK DATA
export const updateBook = async (req, res) => {
    try {
        const {email, password} = req.body[0]
        let data = await query(`SELECT * FROM users WHERE email = $1`, [email])
        let pass = compareFunc(password, data.rows[0].password)
        if(pass){
            let id = req.params.id
            let { title, author, publication_date, genre } = req.body[0]
            if(title.length == 0){
                title = await query(`SELECT title FROM books WHERE id = $1`, [id])
                title = title.rows[0].title
            }
            else if(author.length == 0){
                author = await query(`SELECT author FROM books WHERE id = $1`, [id])
                author = author.rows[0].author
            }
            else if(publication_date.length == 0){
                publication_date = await query(`SELECT publication_date FROM books WHERE id = $1`, [id])
                publication_date = publication_date.rows[0].publication_date
            }
            else if(genre.length == 0){
                genre = await query(`SELECT genre FROM books WHERE id = $1`, [id])
                genre = genre.rows[0].genre
            }
            await query(`UPDATE books SET title = $1, author = $2, publication_date = $3, genre = $4 WHERE id = $5`, [title, author, publication_date, genre, id])
            res.send("Updated successfully")
        }
        else
            res.send("Couldn't log in")
    } catch (err) {
        res.send("An error while updating data")
    }
}

// DELETE BOOK
export const deleteBook = async (req, res) => {
    try {
        const {email, password} = req.body[0]
        let data = await query(`SELECT * FROM users WHERE email = $1`, [email])
        let pass = compareFunc(password, data.rows[0].password)
        if(pass){
            let id = req.params.id
            await query(`DELETE FROM books WHERE id = $1`, [id])
            res.send("DELETED data")
        }
        else
            res.send("Couldn't log in")
    } catch (err) {
        res.send("An error while deleting")
    }
}
// =====================================================





// COMMENTS
// ADD COMMENT TO BOOK
export const addComment = async (req, res) =>{
    try {
        const {email, password} = req.body[0]
        let data = await query(`SELECT * FROM users WHERE email = $1`, [email])
        let pass = compareFunc(password, data.rows[0].password)
        if(pass){
            let { text, book_title, username } = req.body[0]
            book_title = await query(`SELECT id FROM books WHERE title = $1`, [book_title])
            username = await query(`SELECT id FROM users WHERE name = $1`, [username])
            await query(`INSERT INTO comments(text, created_at, book_id, user_id) VALUES($1, $2, $3, $4)`, [text,  genDate(), book_title.rows[0].id, username.rows[0].id])
            res.send("Added comment SUCCESSFULY")
        }
        else
            res.send("Couldn't log in")
    } catch (err) {
        res.send("An error occured while adding comment.")
    }
}

// GET ALL COMMENTS
export const getComments = async (req, res) => {
    try {
        const {email, password} = req.body[0]
        let data = await query(`SELECT * FROM users WHERE email = $1`, [email])
        let pass = compareFunc(password, data.rows[0].password)
        if(pass){
            let id = req.params.id
            let result = await query(`SELECT * FROM comments WHERE book_id = $1`, [id])
            res.send(result.rows)
        }
        else
            res.send("Couldn't log in")
    } catch (err) {
        res.send("An error occured reading comments.")
    }
}
// =================================================




// PHOTOS
// ADD PHOTOS TO BOOK
export const addPhoto = async (req, res) =>{
    try {
        const {email, password} = req.body[0]
        let data = await query(`SELECT * FROM users WHERE email = $1`, [email])
        let pass = compareFunc(password, data.rows[0].password)
        if(pass){
            let { url, book_title } = req.body[0]
            book_title = await query(`SELECT id FROM books WHERE title = $1`, [book_title])
            await query(`INSERT INTO photos(url, uploaded_at, book_id) VALUES($1, $2, $3)`, [url,  genDate(), book_title.rows[0].id])
            res.send("Added photo SUCCESSFULY")
        }
        else
            res.send("Couldn't log in")
    } catch (err) {
        res.send("An error occured while adding photo.")
    }
}

// GET ALL PHOTOS
export const getPhotos = async (req, res) => {
    try {
        const {email, password} = req.body[0]
        let data = await query(`SELECT * FROM users WHERE email = $1`, [email])
        let pass = compareFunc(password, data.rows[0].password)
        if(pass){
            let id = req.params.id
            let result = await query(`SELECT * FROM photos WHERE book_id = $1`, [id])
            res.send(result.rows)
        }
        else
            res.send("Couldn't log in")
    } catch (err) {
        res.send("An error occured reading comments.")
    }
}

// =====================================================





// ADD BLOGS
export const addBlog = async (req, res) => {
    try {
        const {email, password} = req.body[0]
        let data = await query(`SELECT * FROM users WHERE email = $1`, [email])
        let pass = compareFunc(password, data.rows[0].password)
        if(pass){
            let {title, content, username, password} = req.body[0]
            let tcheck = await query(`SELECT * FROM blogs WHERE title = $1`, [title])
            if(tcheck.rows.length != 0){
                res.send("This blog already exists")
            }
            else{
                if(title && content && username){
                    username = await query(`SELECT id FROM users WHERE name = $1`, [username])
                    if(username.rows.length == 0){
                        res.status(400).send("No user found with provided username")
                    }
                    else{
                        await query(`INSERT INTO blogs(title, content, posted_at, author_id) VALUES($1, $2, $3, $4, $5)`, [title, content, genDate(), username.rows[0].id])
                        res.send("Added Blog")
                    }
                }
                else{
                    res.send("Not enugh data provided.")
                }
            }
        }
        else 
            res.send("Couldn't log in")
    } catch (err) {
        res.send(`${err}`)
    }
}

// GET ALL BLOGS
export const allBlogs = async (req, res) => {
    try {
        const {email, password} = req.body[0]
        let data = await query(`SELECT * FROM users WHERE email = $1`, [email])
        let pass = compareFunc(password, data.rows[0].password)
        if(pass){
            let result = await query(`SELECT * FROM blogs`)
            res.send(result.rows)
        }
        else
            res.send("Couldn't log in")
    } catch (err) {
        res.send("Couldn't read data from database")
    }
}

// GET BLOG BY ID
export const getBlogById = async (req, res) => {
    try {
        const {email, password} = req.body[0]
        let data = await query(`SELECT * FROM users WHERE email = $1`, [email])
        let pass = compareFunc(password, data.rows[0].password)
        if(pass){
            let id = req.params.id
            let result = await query(`SELECT * FROM blogs WHERE id = $1`, [id])
            if(result.rows.length == 0){
                res.send(`No blog with id ${id}`)
            }
            else
                res.send(result.rows)
        }
        else
            res.send("Couldn't log in")
    } catch (err) {
        res.send("Error while getting data from DB")
    }
}

// PUT BLOG DATA
export const updateBlog = async (req, res) => {
    try {
        const {email, password} = req.body[0]
        let data = await query(`SELECT * FROM users WHERE email = $1`, [email])
        let pass = compareFunc(password, data.rows[0].password)
        if(pass){
            let id = req.params.id
            let { title, content, posted_at } = req.body[0]
            if(title.length == 0){
                title = await query(`SELECT title FROM blogs WHERE id = $1`, [id])
                title = title.rows[0].title
            }
            else if(author.length == 0){
                author = await query(`SELECT content FROM blogs WHERE id = $1`, [id])
                author = author.rows[0].author
            }
            else if(publication_date.length == 0){
                publication_date = await query(`SELECT posted_at FROM blogs WHERE id = $1`, [id])
                publication_date = publication_date.rows[0].publication_date
            }
            await query(`UPDATE blogs SET title = $1, content = $2, posted_at = $3  WHERE id = $5`, [title, content, posted_at, id])
            res.send("Updated blog successfully")
        }
        else
            res.send("Couldn't log in")
    } catch (err) {
        res.send("An error while updating data")
    }
}

// DELETE BLOG
export const deleteBlog = async (req, res) => {
    try {
        const {email, password} = req.body[0]
        let data = await query(`SELECT * FROM users WHERE email = $1`, [email])
        let pass = compareFunc(password, data.rows[0].password)
        if(pass){
            let id = req.params.id
            await query(`DELETE FROM blogs WHERE id = $1`, [id])
            res.send("DELETED data")
        }
        else
            res.send("Couldn't log in")
    } catch (err) {
        res.send("An error while deleting")
    }
}











// try{
//     query("CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, name VARCHAR(30), email VARCHAR(40),password VARCHAR(30), created_at VARCHAR(40))")
//     query("CREATE TABLE IF NOT EXISTS books(id SERIAL PRIMARY KEY, title VARCHAR(30), author VARCHAR(40), publication_date VARCHAR(40), genre VARCHAR(30), user_id INT, FOREIGN KEY(user_id) REFERENCES users(id))")
//     query("CREATE TABLE IF NOT EXISTS comments(id SERIAL PRIMARY KEY, text VARCHAR(100), created_at VARCHAR(40), book_id INT, user_id INT, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(book_id) REFERENCES books(id))")
//     query("CREATE TABLE IF NOT EXISTS photos(id SERIAL PRIMARY KEY, url VARCHAR(30), book_id INT, uploaded_at VARCHAR(40), FOREIGN KEY(book_id) REFERENCES books(id))")
//     query("CREATE TABLE IF NOT EXISTS blogs(id SERIAL PRIMARY KEY, title VARCHAR(30), content VARCHAR(100), posted_at VARCHAR(40), author_id int, foreign key(author_id) references users(id))")
//     query("CREATE TABLE IF NOT EXISTS blogsComment(id SERIAL PRIMARY KEY, text VARCHAR(100), created_at VARCHAR(40), blog_id int, user_id int, foreign key(blog_id) REFERENCES blogs(id), FOREIGN KEY (user_id) REFERENCES users(id))")
// }catch(err){
//     console.log("Error creating table!")
// }