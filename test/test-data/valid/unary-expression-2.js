const data = {
  _insertUserName() {
    const insertUser = this.curr._insertUser;
    if (!insertUser) { return '{SYSTEM}'; }
    return insertUser.sAcctName;
  },
}
