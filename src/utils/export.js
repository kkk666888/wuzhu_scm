import FileSaver from 'file-saver';
function exportFile(data, fileName) {
  let bytes = window.atob(data);
  let length = bytes.length;
  let u8arr = new Uint8Array(length);
  while (length--) {
    u8arr[length] = bytes.charCodeAt(length);
  }
  try {
    FileSaver.saveAs(new Blob([u8arr], { type: 'application/octet-stream' }), fileName + '.xls');
  } catch (e) {
    if (typeof console !== 'undefined') {
      console.log(e, data);
    }
  }
}

export default exportFile;
