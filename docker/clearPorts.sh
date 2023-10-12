for port in "$@" 
do
    echo "Portname - $port";
    id=$(lsof -t -i:$port);
    while id;
    do
        kill -9 $id;
        id=$(lsof -t -i:$port);
    done
        echo "cleared -$port";
done
