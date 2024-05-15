import bcrypt from "bcrypt"


export async function hashFunc(password) {
    const saltRounds = 10
    const hash = bcrypt.hashSync(password, saltRounds)
    return hash
  }

export async function compareFunc(inner, hashed) {
    const isEqual = await bcrypt.compareSync(inner, hashed)
    return isEqual
}

export function genDate(){
    let dat = new Date()
    return `${dat.getHours()}:${dat.getMinutes()}, ${dat.getDate()}/${dat.getMonth()}/${dat.getFullYear()}`
}