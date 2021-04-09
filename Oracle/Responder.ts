const fetch = require('node-fetch')

export const validLeagueOptions = ["nba", "wnba", "nba-g-league", "mens-college-basketball", "womens-college-basketball"];

export const validTeamStats = ["rebounds", "avgRebounds", "assists", "fieldGoalsAttempted", "fieldGoaldsMade", "fieldGoalPct", "freeThrowPct", "freeThrowsAttempted", "freeThrowsMade", "threePointPct", "threePointFieldGoalsAttempted", "threePointFieldGoalsMade", "avgPoints", "avgAssists", "threePointFieldGoalPct"]

export const validStatLeaders = ["points leaders", "rebounds leaders", "assists leaders"]

export async function getResponse(query: string, params?: string[]) {
    var ourEvent;
    var ourStat;
    var ourLeader;
    if (!params) {
        console.log(`${query}: ${["Error - Parameters were not provided."]}`);
        return ["Error - Parameters were not provided."];
    } else {
        if (validLeagueOptions.indexOf(params[0]) > -1){
            const dateFormat = new RegExp('[1-9][0-9][0-9][0-9](0[1-9]|1[0-2])([0-2][0-9]|3[0-1])');
            if (dateFormat.test(params[1]) && params[1].length == 8){
                const request = `http://site.api.espn.com/apis/site/v2/sports/basketball/${params[0]}/scoreboard?lang=en&region=us&limit=1000&dates=${params[1]}`;
                if (!params[2] && !params[3]) {
                    console.log(`${query}: ${["Error - Insufficient number of teams provided."]}`);
                    return ["Error - Insufficient number of teams provided."];
                } else {
                    try {
                        let response = await fetch(request);
                        let data = await response.json();
                        for (var event of data.events){
                            if (params[2] == event.competitions[0].competitors[1].team.displayName && params[3] == event.competitions[0].competitors[0].team.displayName) {
                                ourEvent = event;
                            }
                        }
                        if (!ourEvent){
                            console.log(`${query}: ${["Error - Event was not found."]}`);
                            return ["Error - Event was not found."]
                        } else {
                            let homeTeam = ourEvent.competitions[0].competitors[0].team.displayName;
                            let awayTeam = ourEvent.competitions[0].competitors[1].team.displayName;
                            if (ourEvent.status.type.completed) {
                                if (!params[4]){
                                    let homeScore = ourEvent.competitions[0].competitors[0].score;
                                    let awayScore = ourEvent.competitions[0].competitors[1].score;
                                    console.log(`${query}: ${awayTeam} ${awayScore} | ${homeScore} ${homeTeam}`);
                                    return [`${awayTeam} ${awayScore} | ${homeScore} ${homeTeam}`];
                                } else {
                                    if (validTeamStats.indexOf(params[4]) > -1){
                                        for (var stat of ourEvent.competitions[0].competitors[0].statistics){
                                            if (stat.name == params[4]){
                                                ourStat = stat;
                                            }
                                        }
                                        let homeStat = ourStat.displayValue;
                                        let unit = ourStat.abbreviation
                                        for (var stat of ourEvent.competitions[0].competitors[1].statistics){
                                            if (stat.name == params[4]){
                                                ourStat = stat;
                                            }
                                        }
                                        let awayStat = ourStat.displayValue;
                                        console.log(`${query}: ${awayTeam} ${awayStat} | ${unit} | ${homeStat} ${homeTeam}`);
                                        return [`${awayTeam} ${awayStat} | ${unit} | ${homeStat} ${homeTeam}`]
                                    } else if (validStatLeaders.indexOf(params[4]) > -1){
                                        let leaderStat = params[4].split(" ")[0];
                                        for (var leader of ourEvent.competitions[0].competitors[0].leaders){
                                            if (leader.name == leaderStat){
                                                ourLeader = leader;
                                            }
                                        }
                                        let homePlayerStat = ourLeader.leaders[0].value;
                                        let homePlayer = ourLeader.leaders[0].athlete.displayName;
                                        let unit = ourLeader.displayName;
                                        for (var leader of ourEvent.competitions[0].competitors[1].leaders){
                                            if (leader.name == leaderStat){
                                                ourLeader = leader;
                                            }
                                        }
                                        let awayPlayerStat = ourLeader.leaders[0].value;
                                        let awayPlayer = ourLeader.leaders[0].athlete.displayName;
                                        
                                        console.log(`${query}: ${awayPlayer}(${awayTeam}) ${awayPlayerStat.toString()} | ${unit} | ${homePlayerStat.toString()} ${homePlayer}(${homeTeam})`);
                                        return [`${awayPlayer}(${awayTeam}) ${awayPlayerStat.toString()} | ${unit} | ${homePlayerStat.toString()} ${homePlayer}(${homeTeam})`];
                                    } else {
                                        console.log(`${query}: ${["Error - Invalid statistics arguement."]}`);
                                        return ["Error - Invalid statistics arguement."];
                                    }
                                }
                            } else {
                                console.log(`${query}: ${["Error - Game still in progress."]}`);
                                return ["Error - Game still in progress."];
                            }
                        }
                    } catch (e) {
                        console.log(`${query}: ${["Error - Error while fetching data."]}`);
                        return ["Error - Error while fetching data."];
                    }
                }
            } else {
                console.log(`${query}: ${["Error - Invalid date format."]}`);
                return ["Error - Invalid date format."];
            }
        } else {
            console.log(`${query}: ${["Error - Invalid league arguement."]}`);
            return ["Error - Invalid league arguement."];
        }
    }
} 

// Examples
// getResponse("Test 1")
// getResponse("Test 2", ['jnba'])
// getResponse("Test 3", ['wnba', '202011265'])
// getResponse("Test 4", ['wnba', '20201326'])
// getResponse("Test 5", ['wnba', '20201006'])
// getResponse("Test 6", ['wnba', '20201026', "Las Vegas Aces", "Seattle Storm"])
// getResponse("Test 7", ["wnba", "20201006", "Las Vegas Aces", "Seattle Storm"])
// getResponse("Test 8", ["nba", "20210325", "Portland Trail Blazers", "Miami Heat"])
// getResponse("Test 9", ["wnba", "20201006", "Las Vegas Aces", "Seattle Storm", "statistic"])
// getResponse("Test 10", ["wnba", "20201006", "Las Vegas Aces", "Seattle Storm", "fieldGoalPct"])
// getResponse("Test 11", ["wnba", "20201006", "Las Vegas Aces", "Seattle Storm", "assists leaders"])
// getResponse("Test 12", ["mens-college-basketball", "20210312", "UConn Huskies", "Creighton Bluejays"])
// getResponse("Test 13", ["nba", "20210316", "Minnesota Timberwolves", "Los Angeles Lakers"])
// getResponse("Test 14", ["mens-college-basketball", "20140407", "Kentucky Wildcats", "UConn Huskies"])
