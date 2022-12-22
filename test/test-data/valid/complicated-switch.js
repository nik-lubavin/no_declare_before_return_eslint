function a() {
  let replacedInstance = null;

  switch (_verb) {
    case 'insert':
      if (Object.keys(setFields).length === 0) {
        this.emit('save', _changed);
        return this;
      }

      break;

    case 'update': {
      if (changedKeys.length === 0 && this.exitUpdateIfNoChangedKeys) {
        _changed = false;
        this.emit('save', _changed);
        return this;
      }

      if (this.replaceFieldsChanged()) {
        replacedInstance = this._replaceInstance();
      } else {
      }

      break;
    }
  }
}
