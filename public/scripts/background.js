var counter = 0;

function changeBG() {
  var imgs = [
        'url(../imgs/photo-1414016642750-7fdd78dc33d9.jpg)',
        'url(../imgs/photo-1444012236767-1b471c68781c.jpg)',
        'url(../imgs/photo-1444012104069-996724bf4a0a.jpg)',
        'url(../imgs/photo-1445888761652-fc13cbb0d819.jpg)',
        'url(../imgs/photo-1445888985293-8e1b904061c4.jpg)',
        'url(../imgs/photo-1444228250525-3d441b642d12.jpg)',
        'url(../imgs/photo-1444210971048-6130cf0c46cf.jpg)',
        'url(../imgs/photo-1445308394109-4ec2920981b1.jpg)'
      ];

  if (counter === imgs.length) {
    counter = 0;
  }
  document.body.style.backgroundImage = imgs[counter];

  counter++;
}

setInterval(changeBG, 7500);
