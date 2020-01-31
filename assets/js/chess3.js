// board details
const defaultBoard = {
    bqr: 'a8',
    bqn: 'b8',
    bqb: 'c8',
    bq: 'd8',
    bk: 'e8',
    bkb: 'f8',
    bkn: 'g8',
    bkr: 'h8',

    bqrp: 'a7',
    bqnp: 'b7',
    bqbp: 'c7',
    bqp: 'd7',
    bkp: 'e7',
    bkbp: 'f7',
    bknp: 'g7',
    bkrp: 'h7',

    wqr: 'a1',
    wqn: 'b1',
    wqb: 'c1',
    wq: 'd1',
    wk: 'e1',
    wkb: 'f1',
    wkn: 'g1',
    wkr: 'h1',

    wqrp: 'a2',
    wqnp: 'b2',
    wqbp: 'c2',
    wqp: 'd2',
    wkp: 'e2',
    wkbp: 'f2',
    wknp: 'g2',
    wkrp: 'h2',

}

const props = {
    lowerLimit: 1,
    upperLimit: 8,
    files: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    ranks: [ 1, 2, 3, 4, 5, 6, 7, 8],
    filemap: { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 },
    rfilemap: { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h' },
    paths:  {
        rook: [
            [['top', this.upperLimit]], 
            [['bottom', this.upperLimit]], 
            [['left', this.upperLimit]], 
            [['right', this.upperLimit]]
        ],
        bishop: [
            [['ltop', this.upperLimit]], 
            [['rtop', this.upperLimit]], 
            [['lbottom', this.upperLimit]], 
            [['rbottom', this.upperLimit]]
        ],
        pawn: [
            [['top', 2]],
            [['rtop', 1]],
            [['ltop', 1]]
        ],
        king: [
            [['top', 1]],
            [['bottom', 1]],
            [['left', 1]],
            [['right', 1]],
            [['rtop', 1]],
            [['ltop', 1]],
            [['rbottom', 1]],
            [['lbottom',1]]
        ],
        queen: [
            [['top', this.upperLimit]],
            [['bottom', this.upperLimit]],
            [['left', this.upperLimit]],
            [['right', this.upperLimit]],
            [['rtop', this.upperLimit]],
            [['ltop', this.upperLimit]],
            [['rbottom', this.upperLimit]],
            [['lbottom', this.upperLimit]]
        ],
        knight: [
            [['rtop', 1], ['top', 1]], 
            [['rtop', 1], ['right', 1]], 
            [['rbottom', 1], ['right', 1]], 
            [['rbottom', 1], ['bottom', 1]],
            [['ltop', 1], ['top', 1]], 
            [['ltop', 1], ['left', 1]], 
            [['lbottom', 1], ['bottom', 1]], 
            [['lbottom', 1], ['left', 1]]
        ]
    }
}


const chess = {
   linearTraverse: function(posf, posr, direction, steps=props.upperLimit, absolute=false) {
       var allPos = []

       function getPos(pos) {
           if (allPos.length >= steps) {
               return allPos
           }
           if (direction == 'top' || direction == 'right') {
               var npos = pos + 1
               if (npos > props.upperLimit) {
                   return absolute ? [] : allPos
               }
           } else {
               var npos = pos - 1
               if (npos < props.lowerLimit) {
                   return absolute ? []: allPos
               }
           }
           if (direction == 'left' || direction == 'right') {
               allPos.push(props.rfilemap[npos] + posr)
           } else {
               allPos.push(posf + npos)
           }
           return getPos(npos)
       }
       return (direction == 'left' || direction == 'right') ? getPos(props.filemap[posf]) : getPos(posr)
    },

    coordinalTraverse: function(posf, posr, direction, steps=props.upperLimit, absolute=false) {

        var allPos = []

        function getPos(posf, posr) {
            if (allPos.length >= steps) {
                return allPos
            }
            if (direction == 'ltop') {
                nposf = posf - 1
                nposr = posr + 1
                if (nposf < props.lowerLimit || nposr > props.upperLimit) {
                    return absolute ? [] : allPos
                }
            } else if (direction == 'rtop') {
                nposf = posf + 1
                nposr = posr + 1
                if (nposf > props.upperLimit || nposr > props.upperLimit) {
                    return absolute ? [] : allPos
                }

            } else if (direction == 'lbottom') {
                nposf = posf - 1
                nposr = posr - 1
                if (nposf < props.lowerLimit || nposr < props.lowerLimit) {
                    return absolute ? []: allPos
                }

            } else {
                nposf = posf + 1
                nposr = posr - 1
                if (nposf > props.upperLimit || nposr < props.lowerLimit) {
                    return absolute ? [] : allPos
                }
            }
            allPos.push(props.rfilemap[nposf]+nposr)
            return getPos(nposf, nposr)
        }
        return getPos(props.filemap[posf], posr)
   },

   compoundTraverse: function(posf, posr, path, absolute=false) {
       var allPos = []
       function getPos(posf, posr, route, obj) {
           try {
               var direction = route[0]
               var steps = route[1]
           } catch(err) {
               return allPos
           }

           if (direction == 'top' || direction == 'bottom' || direction == 'left' || direction == 'right') {
               var positions  = obj.linearTraverse(posf, posr, direction, steps, absolute)
           } else {
               var positions = obj.coordinalTraverse(posf, posr, direction, steps, absolute)
           }

           if (positions && positions.length == 0) {
               return absolute ? [] : allPos
           }

           allPos = allPos.concat(positions)
           if (path && path.length == 0) {
               return allPos
           }

           nextPos = positions.pop()
           nextRoute = path.shift()
           return getPos(nextPos[0], parseInt(nextPos[1]), nextRoute, obj)
       }
       if (path && path.length) {
           return getPos(posf, posr, path.shift(), this)
       }
       return []
   }, 

   getPossiblePositions: function(piece, pos) {
       var posf = pos[0]
       var posr = parseInt(pos[1], 10)
       var allPos = []
       if (!Object.keys(props.paths).includes(piece)) {
           return
       }
       if (!props.files.includes(posf)) {
           return 
       }
       if (!props.ranks.includes(posr)){
           return
       }
       if (piece == 'knight') {
            // for KNIGHT, we only need endpoints as positions are not sequential
           for (path in props.paths[piece]) {
               var pt = chess.compoundTraverse(posf, posr, props.paths[piece][path].slice(0), true)
               if (pt) allPos.push(pt.slice(-1)[0])
           }
       } else {
           for (path in props.paths[piece]) {
               var pt = chess.compoundTraverse(posf, posr, props.paths[piece][path].slice(0), false)
               allPos = allPos.concat(pt)
           }
       }
       return Array.from(new Set(allPos)) 
   },

   validatePositions: function(piece, currentPos, board, targetPos) {
       // get possible positions
       if (piece.charAt(piece.length-1) == 'p') {
           var possiblePossitions = chess.getPossiblePositions('pawn', currentPos)
       } else if (piece.charAt(piece.length-1) == 'r') {
           var possiblePossitions = chess.getPossiblePositions('rook', currentPos)
       } else if (piece.charAt(piece.length-1) == 'n') {
           var possiblePossitions = chess.getPossiblePositions('knight', currentPos)
       } else if (piece.charAt(piece.length-1) == 'b') {
           var possiblePossitions = chess.getPossiblePositions('bishop', currentPos)
       } else if (piece.charAt(piece.length-1) == 'q') {
           var possiblePossitions = chess.getPossiblePositions('queen', currentPos)
       } else if (piece.charAt(piece.length-1) == 'k') {
           var possiblePossitions = chess.getPossiblePositions('king', currentPos)
       } else {
           console.log("Invalid piece")
           return false
       } 

       // check if targetPos is valid possible position
       if (!possiblePossitions.includes(targetPos)) {
           return false
       }
       // check if piece from own side not there
       var targetPosPiece = board[targetPos]
       if (targetPosPiece && targetPosPiece.starsWith(piece.chartAt(0))) {
           return false
       }
       // pawn has a special case, pawn can't move coorodianl if another piece not present there
       // check if piece is pawn
       // && check if target pos is diagonal by checking files are different
       // && check if any piece there from opposite side, we are already ruling out piece with same side, so just check if piece is prsent
       if (piece.chartAt(piece.length-1) == 'p' && currentPos.charAt(0) != targetPos.chartAt(0) && !targetPosPiece) {
           return false
       }
       return true
   }, 

   checkForCheckmate: function() {
       // check if possible side's king is in danger
   },

   checkForOwnmate: function() {
       // check if own king is in danger
   }

}


function runTests(name=null) {
    var tests = {
        // getPossiblePositions test
        test1: {
            input: ['pawn', 'c5'],
            output: ['b6', 'c6', 'd6', 'c7'],
            func: chess.getPossiblePositions
        },
        test2: {
            input: ['king', 'c5'],
            output: ['b4', 'b5', 'b6', 'c4', 'c6', 'd4', 'd5', 'd6'],
            func: chess.getPossiblePositions
        },
        test3: {
            input: ['queen', 'c5'],
            output: ['a5', 'b5', 'd5', 'e5', 'f5', 'g5', 'h5', 'c1', 'c2', 'c3', 'c4', 'c6', 'c7', 'c8', 'a3', 'b4', 'd6', 'e7', 'f8', 'a7', 'b6', 'd4', 'e3', 'f2', 'g1'],
            func: chess.getPossiblePositions
        },
        test4: {
            input: ['bishop', 'c5'],
            output: ['a3', 'b4', 'd6', 'e7', 'f8', 'a7', 'b6', 'd4', 'e3', 'f2', 'g1'],
            func: chess.getPossiblePositions
        },
        test5: {
            input: ['rook', 'c5'],
            output: ['a5', 'b5', 'd5', 'e5', 'f5', 'g5', 'h5', 'c1', 'c2', 'c3', 'c4', 'c6', 'c7', 'c8'],
            func: chess.getPossiblePositions
        },
        test6: {
            input: ['knight', 'c5'],
            output: ['b7', 'd7', 'a6', 'e6', 'b3', 'd3', 'e4', 'a4'],
            func: chess.getPossiblePositions
        },

        // getValidPositions test
        test8: {
            input: ['pawn', 'b2', defaultBoard, 'a2'],
            output: false,
            func: function() {
                return chess.validatePositions
            }
        },

    }

    function results(name, input, output, resp) {
        // todo add support for all datatypes
        console.log('output - ')
        console.log(output)
        if (Array.isArray(output) && Array.isArray(resp)) {
            console.log("Name - ", name, " | Input - ", input, " | Output - ", output, " | Resp - ", resp, " | Result -", (output.sort().toString() == resp.sort().toString()))
        } else if (typeof output === 'boolean' && typeof resp === 'boolean') {
            console.log("Name - ", name, " | Input - ", input, " | Output - ", output, " | Resp - ", resp, " | Result -", output == resp)
        } else {
            console.log("Name - ", name, " | Input - ", input, " | Output - ", output, " | Resp - ", resp, " | Result -", output == resp)
        }
    }

    if (name) {
        var input = tests[name]['input']
        var output = tests[name]['output']
        var resp = tests[name]['func']()(...input)
        results(name, input, output, resp)
    } else {
        for (let name in tests) {
            console.log("Starting new test...", name)
            var input = tests[name]['input']
            var output = tests[name]['output']
            var resp = tests[name]['func'](...input)
            results(name, input, output, resp)
        }

    }

}

runTests('test8')
