
const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
const story = document.querySelector('.story');

function randomValueFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}


const storyText = "It was 94 fahrenheit outside, so :insertx: went for a walk. When they got to :inserty:, they stared in horror for a few moments, then :insertz:. Bob saw the whole thing, but was not surprised — :insertx: weighs 300 pounds, and it was a hot day.";

const insertX = [
    "John Cena",
    "White accountant Mark S",
    "Peter Griffin"
];

const insertY = [
    "Jones BBQ and Foot Massage",
    "Water World",
    "Port-a-potty"
];

const insertZ = [
    "criminally cried",
    "got loose bones and folded like a pancake",
    "got their bracket broken and was taken by the Chinese mafia"
];


randomize.addEventListener('click', result);

function result() {
    let newStory = storyText;
    
    let xItem = randomValueFromArray(insertX);
    let yItem = randomValueFromArray(insertY);
    let zItem = randomValueFromArray(insertZ);

    
    
    newStory = newStory.replaceAll(":insertx:", xItem);
    newStory = newStory.replace(':inserty:', yItem);
    newStory = newStory.replace(':insertz:', zItem);
    
    if (customName.value !== '') {
        const name = customName.value;
        newStory = newStory.replace('Bob', name);
    }
    
    if (document.getElementById("uk").checked) {
        const weight = Math.round(300 / 14) + ' stone'; 
        const temperature = Math.round((94 - 32) * 5 / 9) + ' centigrade'; 
        
        newStory = newStory.replace('94 fahrenheit', temperature);
        newStory = newStory.replace('300 pounds', weight);
    }
    
    story.textContent = newStory;
    story.style.visibility = 'visible';
}
