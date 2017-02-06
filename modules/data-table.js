'use strict';

let Exceljs = require('exceljs');
let Promise = require('es6-promise').Promise;
let validators = require('../helpers/validator');
let columnTypes = require('../helpers/column-types');


let fromWorkbook = function fromWorkbook(workbook, id) {
  id = validators.isDefined(id) ? id : 1;

  let worksheet = workbook.getWorksheet(id);

  return fromWorksheet(worksheet);
};


let fromWorksheet = function fromWorksheet(worksheet) {
  if (worksheet.actualRowCount < 1) {
    return Promise.reject('empty file.');
  }

  let datatable = { cols: [], rows: [] };

  // default data type for role: 'domain'
  let defaultDomainType = 'string';

  // default data type for role: 'data'
  let defaultDataType = 'number';

  let preferredColumnDataType = [];

  worksheet.eachRow(function (row, rowNumber) {
    // process header row
    if (rowNumber === 0) {
      row.eachCell(function (cell, colNumber) {
        datatable.cols.push({
          label: cell.value ? cell.value : 'Column' + colNumber,
          type: (colNumber === 0) ? defaultDomainType : defaultDataType
        });
      });

    // process data rows
    } else {
      let rowData = { c: [] };

      row.eachCell(function (cell, colNumber) {
        rowData.c.push({
          v: columnTypes.convertFileToDataTable(cell.value)
        });

        if (!preferredColumnDataType[colNumber]) {
          let inferredType = columnTypes.infer(cell.value);

          preferredColumnDataType[colNumber] =
            inferredType === 'null'
              ? undefined
              : inferredType;
        }
      });

      datatable.rows.push(rowData);
    }
  });

  // determine preferred data types
  preferredColumnDataType.forEach(function (type, index) {
    if (type) {
      datatable.cols[index].type = type;

    } else {
      datatable.cols[index].type =
        (index === 0)
          ? defaultDomainType
          : defaultDataType;
    }
  });

  return datatable;
};


exports.fromStreamXLSX = function fromStreamXLSX(stream) {
  let workbook = new Exceljs.Workbook();

  return workbook.xlsx.read(stream)
    .then(function (workbook) {
      return fromWorkbook(workbook);
    });
};
