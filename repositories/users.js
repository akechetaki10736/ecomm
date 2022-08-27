const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
    async create (attrs) {
        attrs.id = this.randomId();

        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${buf.toString('hex')}.${salt}`
        }
        records.push(record);
        //write the updated 'records' array back to this.filename
        await this.writeAll(records);

        return record;
    }

    async comparePasswords (saved, supplied) {
        const [hased, salt] = saved.split('.');
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

        return hased === hashedSuppliedBuf.toString('hex');
    }
}

//when require, this file will only execute once, and store reference in require cache
const test = async () => {
    await this.getOneBy();
}

module.exports = new UsersRepository('users.json');