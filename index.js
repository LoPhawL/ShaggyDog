const fs = require('fs');
const configs = JSON.parse(fs.readFileSync('./tasks.json'));

const configuredCommands = configs.commands

const notifier = require('node-notifier')
const path = require('path');

document.getElementById('addCommand_add_btn').onclick = (event) => {

    const commandNameEl = document.getElementById('addCommand_commandName_in');
    const commandEl = document.getElementById('addCommand_commad_in');

    if( commandNameEl.value && commandEl.value)
    {
        const name = commandNameEl.value;
        const command = commandEl.value;
        configuredCommands[name] =command;
        UpdateCommandListInView();
        WriteCommandToFile();
        
        commandEl.value = '';
        commandNameEl.value = '';
    }
    else{
        alert('Enter the command and name')
    }
}

UpdateCommandListInView = function()
{
    let commandList = '';
    for(const command in configuredCommands)
    {
        commandList += `<li class="list-group-item" style="cursor:pointer;" onclick="ExecuteCommand(this)">${command}</li>`
    }
    if(commandList === '')
    {
        commandList = '<strong>No command found.</strong>'
    }
    document.getElementById('existingCommandsLis_ul').innerHTML = commandList;
}

WriteCommandToFile = function()
{
    fs.writeFile('./tasks.json', JSON.stringify(configs), ()=>{
        
        notifier.notify ({
            title: 'Added command',
            message: 'Added your command successfully',
            sound: true,  
            wait: true,    
            type:'info'
         });
    });
}

ExecuteCommand = function(element)
{
    let commandName = element.innerText;
    const command = configuredCommands[commandName];
    if(!command){return;}
    // console.log(command);
    // return;
    const { exec } = require('child_process');
    exec(command, (err, stdout, stderr) => {
        if (err) {
            notifier.notify ({
                title: 'Error',
                message:'Error while executing your command.',
                sound: true,  
                wait: true,    
                type:'info'
             });
            return;
        }
        notifier.notify ({
            title: 'Executed command successfully',
            sound: true,  
            wait: true,    
            type:'info'
         });
    });
}

this.UpdateCommandListInView();