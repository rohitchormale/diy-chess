// board details
const props = {
    lowerLimit: 1,
    upperLimit: 8,
    files: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    ranks: [ 1, 2, 3, 4, 5, 6, 7, 8],
    filemap: { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 },
    rfilemap: { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h' },
}

const chess = {
   linearTraverse: function(pos, direction, steps=props.upperLimit, absolute=false) {
       var posf = pos[0]
       var posr = parseInt(pos[1])
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

    coordinalTraverse: function(pos, direction, steps=props.upperLimit, absolute=false) {

   }

   
}

