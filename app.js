import fetch from 'node-fetch';

const username = '';
const appPassword = '';
const workspace = 'pentabdev';
const repoName = '';

const url = `https://api.bitbucket.org/2.0/repositories/${workspace}/${repoName}/commits`;

fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': 'Basic ' + Buffer.from(`${username}:${appPassword}`).toString('base64')
  }
})
  .then(res => {
    if (!res.ok) {
      console.log(`HTTP error! status: ${res.status}`);
      return null ;
    }
    return res.json(); 
  })
  .then(data => {
    if (data.values) {
      console.log(`Total Commits is : ${data.values.length}\n`);
      data.values.forEach((commit, i) => {
        console.log(`Commit => ${i + 1}`);
        console.log('Message :', commit.message);
        console.log('Hash :', commit.hash);
        console.log('User :', commit.author.user.display_name);
        const [date, time] = commit.date.split('T');
        console.log('Date :', date);
        console.log('Time :', time.split('+')[0]); 
        console.log("\n#################\n")

      });
    } else {
      console.log('No commits found or error occurred:', data);
    }
  })
  .catch(err => {
    console.error('Error:', err); // عرض الخطأ إذا كان موجودًا.
  });
