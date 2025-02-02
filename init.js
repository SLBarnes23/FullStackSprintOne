const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const myArgs = process.argv.slice(2);

const folders = ['models', 'views', 'routes', 'logs', 'json'];

const configjson ={
    name: 'AppConfigCLI',
    version: '1.0.0',
    description: 'The Command Line Interface (CLI) for the MyApp.',
    main: 'myapp.js',
    superuser: 'admin',
    database: 'exampledb'
};

function createFiles() {
    if(DEBUG) console.log('init.createFiles()');
    try {
        let configdata = JSON.stringify(configjson, null, 2);
        let fileName = './json/config.json'
        if(!fs.existsSync(path.join(__dirname, fileName))) {
            fs.writeFile(fileName, configdata, (err) => {
                if(err) {
                    if (err.code == 'ENOENT') {
                        myEventEmitter.emit('event', fileName, 'ERROR', `The ${fileName} was in error, no file or directory.`);
                        console.log('No file or directory, has the directory been created.');
                    }
                    else
                        console.log(err);
                }
                else {
                    myEventEmitter.emit('event', fileName, 'INFO', `The ${fileName} was successfully written to disk.`);
                    console.log('Data written to config file.');
                }
            })
        } else {
          myEventEmitter.emit('event', fileName, 'INFO', `The ${fileName} already exists.`);
          console.log('config file already exists.');
        }
    } catch(err) {
        if (err.code == 'ENOENT')
            console.log('no file or directory');
        else
            console.log(err);
    }
  };


async function createFolders() {
    if (DEBUG) console.log('init.createFolders()');
    let mkcount = 0;
    for (const folder of folders) {
        if (DEBUG) console.log(folder);
        try {
            if (!fs.existsSync(path.join(__dirname, folder))) {
                await fsPromises.mkdir(path.join(__dirname, folder));
                mkcount++;
            }
        } catch (err) {
            console.log(err);
        }
    }
    if (mkcount === 0) {
        console.log('All folders already exist.');
    } else if (mkcount <= folders.length) {
        console.log(mkcount + ' of ' + folders.length + ' folders were created.');
    } else {
        console.log('All folders successfully created.');
    }
}

function initializeApplication() {
    if (DEBUG) console.log('initializeApplication()');

    switch (myArgs[1]) {
        case '--all':
            if (DEBUG) console.log('--all createFolders() & createFiles()');
                        break;
        case '--cat':
            if (DEBUG) console.log('--cat createFiles()');
            createFiles();
            break;
        case '--mk':
            if (DEBUG) console.log('--mk createFolders()');
            createFolders();
            break;
        case '--help':
        case '--h':
        default:
            fs.readFile(__dirname + "/usage.txt", (error, data) => {
                if (error) throw error;
                console.log(data.toString());
            });
    }
}

function createFiles() {
    // Your logic to create files
}

module.exports = { initializeApplication };
