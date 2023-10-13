# Docker Images
## SCORACLE.BB
- Zap Oracle that uses ESPN's API to query for final boxscores and key statistiscs from specific games in any of the American pro, semi-pro, and collegiate leagues.
- It responds with format `['awayTeam' 'awayScore' | 'homeScore' 'homeTeam']`.
- It implements `https://github.com/zapproject/zap-oracle-template` using a custom Responder.ts file.
### Requirements: 
- Have Mnemonic for wallet, with ETH to fullfill queries.
### Build image locally
- `cd SCORACLE.BB`
- `docker build . --no-cache -t zap-scoracle.bb`
### Optional to push image to dockerhub
- `docker image push zap-scoracle.bb`
### Run image
- Mount the local config file to the container with following command: 
    + `docker run --mount type=bind,source="$(pwd)"/path_to_local_file/Config.json,target=/zap/zap-oracle-template/Oracle/Config.json zap-scoracle.bb`
### Result :
Container will:  
- Create Oralce and Endpoint if none exists in Zap Registry.
- Push information such as description and and query list to ipfs which will be displayed on zap admin site.
- Listen to query with format: `["League", "Date", "Away Team", "Home Team", "Valid Statistic (Optional)"]`
    + Example: `["mens-college-basketball", "20140407", "Kentucky Wildcats", "UConn Huskies"]`
- Valid inputs for required arguements:
    + League: `["nba", "wnba", "nba-g-league", "mens-college-basketball", "womens-college-basketball"]`
    + Date Format: `YYYYMMDD`
    + Team Names: Same as the full display name of every team on ESPN's site. (CASE SENSITIVE!)
- Valid inputs for optional arguements:
    + Valid Statistic: ```["rebounds", "avgRebounds", "assists", "fieldGoalsAttempted", "fieldGoaldsMade", "fieldGoalPct", "freeThrowPct", "freeThrowsAttempted", "freeThrowsMade", "threePointPct", "threePointFieldGoalsAttempted", "threePointFieldGoalsMade", "avgPoints", "avgAssists", "threePointFieldGoalPct", "points leaders",                "rebounds leaders", "assists leaders"]```
- Responds with the final boxscore of a game or a comparison of the teams or team leaders within a specified stat category.
