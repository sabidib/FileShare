#@author Samy Abidib 6909624
mkdir -p output/$1
java -jar bin/umple.jar -g Java --path output/$1 $1.ump
java -jar bin/umple.jar -g GvClassDiagram --path . $1.ump
dot -Tpng $1cd.gv -o $1.png
rm $1cd.gv