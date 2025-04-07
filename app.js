import fetch from 'node-fetch';

const username = '';
const appPassword = '';
const workspace = '';
const repoName = '';
const targetDate = new Date("2024-10-01");
// const targetDate = null;
let filteredCommits;
let counter = 0;
let x = 0;
let pageLength = 0;

let url = `https://api.bitbucket.org/2.0/repositories/${workspace}/${repoName}/commits`;

async function getCommits() {
    while (url) {
        // console.log("Fetching:", url);
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${username}:${appPassword}`).toString('base64')
            }
        });

        const data = await res.json();

        if (data.values) {
            if (targetDate) {
                filteredCommits = data.values.filter(commit => {
                    const commitDate = new Date(commit.date);
                    return commitDate >= targetDate;
                });
            }
            else {
                filteredCommits = data.values;
            }

            if (filteredCommits.length === 0) {
                url = null;
                break;
            }

            if (counter === 0) {
                pageLength = filteredCommits.length;
            }

            x = pageLength * counter;
            console.log(`Commits ${x + 1} => ${x + filteredCommits.length}\n`);
            filteredCommits.forEach((commit, i) => {
                console.log(`Commit => ${i + 1 + x}`);
                console.log('Message :', commit.message);
                console.log('Hash :', commit.hash);
                console.log('User :', commit.author?.user?.display_name || commit.author?.raw || "Unknown User");
                const [date, time] = commit.date.split('T');
                console.log('Date :', date);
                console.log('Time :', time.split('+')[0]);
                console.log("\n#################\n")
            });

        } else {
            console.log('No commits found or error occurred:', data);
        }

        url = data.next;
        counter++;
    }
}

getCommits();
