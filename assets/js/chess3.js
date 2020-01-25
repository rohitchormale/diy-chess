// board details
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
               var pt = this.compoundTraverse(posf, posr, props.paths[piece][path].slice(0), true)
               if (pt) allPos.push(pt.slice(-1)[0])
           }
       } else {
           for (path in props.paths[piece]) {
               var pt = this.compoundTraverse(posf, posr, props.paths[piece][path].slice(0), false)
               allPos = allPos.concat(pt)
           }
       }
       return Array.from(new Set(allPos)) 
   },

   getValidPostions: function(piece, positions, board) {

   }
}


function runTests(name=null) {
    var tests = {
        test1: {
            input: ['pawn', 'c5'],
            output: ['b6', 'c6', 'd6', 'c7']
        },
        test2: {
            input: ['king', 'c5'],
            output: ['b4', 'b5', 'b6', 'c4', 'c6', 'd4', 'd5', 'd6']
        },
        test3: {
            input: ['queen', 'c5'],
            output: ['a5', 'b5', 'd5', 'e5', 'f5', 'g5', 'h5', 'c1', 'c2', 'c3', 'c4', 'c6', 'c7', 'c8', 'a3', 'b4', 'd6', 'e7', 'f8', 'a7', 'b6', 'd4', 'e3', 'f2', 'g1']
        },
        test4: {
            input: ['bishop', 'c5'],
            output: ['a3', 'b4', 'd6', 'e7', 'f8', 'a7', 'b6', 'd4', 'e3', 'f2', 'g1']
        },
        test5: {
            input: ['rook', 'c5'],
            output: ['a5', 'b5', 'd5', 'e5', 'f5', 'g5', 'h5', 'c1', 'c2', 'c3', 'c4', 'c6', 'c7', 'c8']
        },
        test6: {
            input: ['knight', 'c5'],
            output: ['b7', 'd7', 'a6', 'e6', 'b3', 'd3', 'e4', 'a4']
        },
    }

    if (!name) {
        for (let name in tests) {
            console.log("Starting new test...", name)
            var input = tests[name]['input']
            var output = tests[name]['output']
            var resp = chess.getPossiblePositions(input[0], input[1])
            console.log(name, input, output, resp, (output.sort().toString() == resp.sort().toString()))
        }
    } else {
        var input = tests[name]['input']
        var output = tests[name]['output']
        var resp = chess.getPossiblePositions(input[0], input[1])
        console.log(name, input, output, resp, (output.sort().toString() == resp.sort().toString()))
    }
}

runTests('test3')
 



