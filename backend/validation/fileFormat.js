const fileFormat = (file) => {
  if (
    file.path.split('.')[1] === 'jpeg' ||
    file.path.split('.')[1] === 'jpg' ||
    file.path.split('.')[1] === 'word' ||
    file.path.split('.')[1] === 'docx' ||
    file.path.split('.')[1] === 'doc' ||
    file.path.split('.')[1] === 'pdf' ||
    file.path.split('.')[1] === 'png'
  )
    return true;
  else return false;
};

module.exports = fileFormat;
