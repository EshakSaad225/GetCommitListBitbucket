import fetch from 'node-fetch';

const username = '';
const appPassword = '';
const workspace = '';
const repoName = '';
const targetDate = new Date("2025-03-01");
// const targetDate = null;
let filteredCommits;
let flag = false;

let url = `https://api.bitbucket.org/2.0/repositories/${workspace}/${repoName}/commits`;

fetch(url, {
    method: 'GET',
    headers: {
        'Authorization': 'Basic ' + Buffer.from(`${username}:${appPassword}`).toString('base64')
    }
})
    .then(res => {
        if (!res.ok) {
            console.log(`HTTP error! status: ${res.status}`);
            return null;
        }
        return res.json();
    })
    .then(data => {
        do {
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
                console.log(`Total Commits is : ${filteredCommits.length}\n`);
                filteredCommits.forEach((commit, i) => {
                    console.log(`Commit => ${i + 1}`);
                    console.log('Message :', commit.message);
                    console.log('Hash :', commit.hash);
                    console.log('User :', commit.author.user.display_name);
                    const [date, time] = commit.date.split('T');
                    console.log('Date :', date);
                    console.log('Time :', time.split('+')[0]);
                    console.log("\n#################\n")
                });

                url = data.next || null;

                if (url) {
                    flag = true;
                }
                else {
                    flag = false;
                }
            } else {
                console.log('No commits found or error occurred:', data);
            }
        } while (flag)
    }
    )
    .catch(err => {
        console.error('Error:', err); 
    });

