if [ ${ENV} = "DEV" ]; then 
    PORT=3001 npm start
else
    npm run build && serve -l 3001 -s build
fi