const textInput = document.getElementById('textInput');
const chat = document.getElementById('chat');

let context = {};

const templateChatMessage = (message, from) => `
  <div class="from-${from}">
    <div class="message-inner">
      <p>${message}</p>
    </div>
  </div>
  `;

// Crate a Element and append to chat
const InsertTemplateInTheChat = (template) => {
  const div = document.createElement('div');
  div.innerHTML = template;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
};

// Calling server and get the watson output
const getWatsonMessageAndInsertTemplate = async (text = '') => {
  document.getElementById("animation").style.display = "block";
  //const uri = 'http://localhost:3000/conversation/';
  const uri = 'http://chatbot-cheerful-antelope.mybluemix.net/conversation/'

  const response = await (await fetch(uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      context,
    }),
  })).json();

  context = response.context;

  console.log(response)
  
  response.output.text.map((item, index) => {
    const template = templateChatMessage(item, 'watson');
  
    InsertTemplateInTheChat(template);
  })

  
  document.getElementById("animation").style.display = "none";
};

textInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13 && textInput.value) {
    getWatsonMessageAndInsertTemplate(textInput.value);

    const template = templateChatMessage(textInput.value, 'user');
    InsertTemplateInTheChat(template);

    textInput.value = '';
  }
});


getWatsonMessageAndInsertTemplate();
