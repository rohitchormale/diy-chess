const lowerLimit = 1
const upperLimit = 8
const files = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8}
const reverseFiles = {1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h'}


function linearTraverse(posf, posr, course, squares=upperLimit, exact=false) {
    var allPos = []

    function getPos(pos) {
        if (allPos.length >= squares) {
            return allPos
        }
        if (course == 'TOP' || course == 'RIGHT') {
            npos = pos + 1
            if (npos > upperLimit) {
                if (exact) {
                    return []
                }
                return allPos
            }
        } else {
            npos = pos - 1
            if (npos < lowerLimit) {
                if (exact) {
                    return []
                }
                return allPos
            }
        }
        if (course == 'LEFT' || course == 'RIGHT') {
            allPos.push(reverseFiles[npos]+posr)
        } else {
            allPos.push(posf+npos)
        }
        return getPos(npos)
    }

    if (course == 'LEFT' || course == 'RIGHT') {
        return getPos(files[posf])
    }
    return getPos(posr)
}


function cooridnalTraverse(posf, posr, course, squares=upperLimit, exact=false) {
    var allPos = []

    function getPos(posf, posr) {
        if (allPos.length >= squares) {
            return allPos
        }

        if (course == 'LTOP') {
            nposf = posf - 1
            nposr = posr + 1
            if (nposf < lowerLimit || nposr > upperLimit) {
                if (exact) {
                    return []
                }
                return allPos
            }
        } else if (course == 'RTOP') {
            nposf = posf + 1
            nposr = posr + 1
            if (nposf > upperLimit || nposr > upperLimit) {
                if (exact) {
                    return []
                }
                return allPos
            }
        } else if (course == 'LBOTTOM') {
            nposf = posf - 1
            nposr = posr - 1
            if (nposf < lowerLimit || nposr < lowerLimit) {
                if (exact) {
                    return []
                }
                return allPos
            }
        } else {
            nposf = posf + 1
            nposr = posr - 1
            if (nposf > upperLimit || nposr < lowerLimit) {
                if (exact) {
                    return []
                }
                return allPos
            }
        }

        allPos.push(reverseFiles[nposf]+nposr)
        return getPos(nposf, nposr)
    }
    return getPos(files[posf], posr)
}


function compoundTraverse(posf, posr, path, exact=false) {
    var allPos = []
    function getPos(posf, posr, route) {
        try {
            course = route[0]
            squares = route[1]
        } catch(err) {
            return allPos
        }

        if (course == 'TOP' || course == 'BOTTOM' || course == 'LEFT' || course == 'RIGHT') {
            positions = linearTraverse(posf, posr, course, squares, exact)
        } else {
            positions = cooridnalTraverse(posf, posr, course, squares, exact)
        }

        if  (!positions) {
            if (exact) {
                return []
            }
            return allPos
        }
    }
    if (path) {
        return getPos(posf, posr, path.pop(0))
    }
    return []
}

function getPos(piece, pos) {
    paths = {
        'ROOK': [
            [['TOP', upperLimit]], 
            [['BOTTOM', upperLimit]], 
            [['LEFT', upperLimit]], 
            [['RIGHT', upperLimit]]
        ],
        'BISHOP': [
            [['LTOP', upperLimit]], 
            [['RTOP', upperLimit]], 
            [['LBOTTOM', upperLimit]], 
            [['RBOTTOM', upperLimit]]
        ],
        'PAWN': [
            [['TOP', 2]],
            [['RTOP', 1]],
            [['LTOP', 1]]
        ],
        'KING': [
            [['TOP', 1]],
            [['BOTTOM', 1]],
            [['LEFT', 1]],
            [['RIGHT', 1]],
            [['RTOP', 1]],
            [['LTOP', 1]],
            [['RBOTTOM', 1]],
            [['LBOTTOM',1]]
        ],
        'QUEEN': [
            [['TOP', upperLimit]],
            [['BOTTOM', upperLimit]],
            [['LEFT', upperLimit]],
            [['RIGHT', upperLimit]],
            [['RTOP', upperLimit]],
            [['LTOP', upperLimit]],
            [['RBOTTOM', upperLimit]],
            [['LBOTTOM', upperLimit]]
        ],
        'KINGHT': [
            [['RTOP', 1], ['TOP', 1]], 
            [['RTOP', 1], ['RIGHT', 1]], 
            [['RBOTTOM', 1], ['RIGHT', 1]], 
            [['RBOTTOM', 1], ['BOTTOM', 1]],
            [['LTOP', 1], ['TOP', 1]], 
            [['LTOP', 1], ['LEFT', 1]], 
            [['LBOTTOM', 1], ['BOTTOM', 1]], 
            [['LBOTTOM', 1], ['LEFT', 1]]
        ]
    }
}