// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var counter = 0;
      var row = this.get(rowIndex);
      for (var i = 0; i < row.length; i++) {
        // if board[rowIndex][i] is Queen, increment counter
        if (row[i] === 1) {
          counter++;
          if (counter === 2) {
            return true;
          }
        }
      }
      //if counter is 2 or more, return true
      // }
      // if loop passed, no conflicts and return false;
      // }
      return false;
      //return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      for (let i = 0; i < this.rows().length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
      //   for i = 0 : n-1 {
      //     if rowConflicts(i) is true, return true
      //   }
      //   if loop passed, no conflicts so return false
      // }
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var counter = 0;
      //   for i = 0 : col.length (n-1) {
      var matrix = this.rows();
      for (let i = 0; i < matrix.length; i++) {
        if (matrix[i][colIndex] === 1) {
          counter++;
          if (counter === 2) {
            return true;
          }
        }
      }
      //     if board[i, colIndex] is Queen return true
      //   }
      //   if loop passed, no conflicts and return false;
      // }

      // }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var matrix = this.rows();
      for (let i = 0; i < matrix.length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      //   for i = 0 : n-1 {
      //     if colConflicts(i) is true, return true
      //   }
      //   if loop passed, no conflicts so return false
      // }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      let counter = 0;
      let matrix = this.rows();
      //let forLength = 0;
      // if (majorDiagonalColumnIndexAtFirstRow < 0) {
      //   forLength = matrix.length;
      // } else {
      //   forLength = matrix.length - majorDiagonalColumnIndexAtFirstRow;
      // }
      let forLength = majorDiagonalColumnIndexAtFirstRow < 0
        ? matrix.length
        : matrix.length - majorDiagonalColumnIndexAtFirstRow;

      for (i = 0; i < forLength; i++) {
        if ((majorDiagonalColumnIndexAtFirstRow + i) >= 0) {
          if (matrix[0 + i][majorDiagonalColumnIndexAtFirstRow + i] === 1) {
            counter++;
            if (counter === 2) {
              return true;
            }
          }
        }
      }
      //   if (indexAtFirstRow + i >= 0) {
      //     if [0+i][indexAtfirstRow+i] is a queen increment counter
      //     if counter = 2, return true
      //   }
      // }
      // return false if for loop is passed through
      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      let n = this.rows().length;
      //for i = -n + 2 to n - 1
      for (let i = (-n + 2); i < n; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      //call hasConflictAt(i)
      //if true return true
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      let matrix = this.rows();
      var counter = 0;
      for (let i = 0; i < matrix.length; i++) {
        if ((minorDiagonalColumnIndexAtFirstRow - i) < matrix.length) {
          if (matrix[0 + i][minorDiagonalColumnIndexAtFirstRow - i] === 1) {
            counter++;
            if (counter === 2) {
              return true;
            }
          }
        }
      }
      // for i = 0; i >= n i++ {
      //   if (indexAtFirstRow - i < n) {
      //   if [0+i][indexAtfirstRow-i] is a queen increment counter
      //   if counter = 2, return true
      // }
      // }
      // return false if for loop is passed through
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      let n = this.rows().length;
      //for i = -n + 2 to n - 1
      for (let i = 0; i < (n + n - 2); i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
