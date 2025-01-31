describe("Autocomplete Plugin", function () {
  beforeEach(async function() {
    await XloadFixtures(['autocomplete/autocompleteFixture.html']);
    //setTimeout(function() {
    M.Autocomplete.init(document.querySelectorAll('input.autocomplete'), {
      data: [
        {id: 12, text: "Apple"},
        {id: 13, text: "Microsoft"},
        {id: 42, text: "Google", image: 'http://placehold.it/250x250'}
      ]
    });
    //done();
    //}, 400);
  });
  afterEach(function(){
    XunloadFixtures();
  });

  describe("Autocomplete", function () {
    // let browserSelect, normalInput, normalDropdown;

    // beforeEach(function() {
    //   browserSelect = $('select.normal');
    // });

    it("should work with multiple initializations", function (done) {
      let normal = document.querySelector('#normal-autocomplete');
      setTimeout(function() {
        M.Autocomplete.init(normal, { "hi": null });
        M.Autocomplete.init(normal, { "hi": null });
        M.Autocomplete.init(normal, { "hi": null });
        M.Autocomplete.init(normal, {
          data: [
            {id: 12, text: "Apple"},
            {id: 13, text: "Microsoft"},
            {id: 42, text: "Google", image: 'http://placehold.it/250x250'}
          ]
        });
        let autocompleteEl = normal.parentNode.querySelectorAll('.autocomplete-content');
        expect(autocompleteEl.length).toEqual(1, 'Should dynamically generate autocomplete structure.');
        done();
      }, 400);
    });

    it("should limit results in search function", function (done) {
      const limited = document.querySelector('#limited-autocomplete');
      const data = [];
      for (let i = 100; i >= 0; i--) {
        const randString = 'a' + Math.random().toString(36).substring(2);
        data.push({id: randString});
      }
      const limitedInstance = M.Autocomplete.getInstance(limited);
      const limit = 20;
      limitedInstance.options.onSearch = (text) => {
        const filteredItems = data.slice(0, limit);
        limitedInstance.setMenuItems(filteredItems);
      };
      
      focus(limited);
      limited.value = 'a';
      keyup(limited, 65);      
      setTimeout(function() {
        const autocompleteEl = limitedInstance.container;
        expect(autocompleteEl.children.length).toEqual(20, 'Results should be at max the set limit');
        done();
      }, 500);
    });

    it("should open correctly from typing", function (done) {
      let normal = document.querySelector('#normal-autocomplete');
      let autocompleteEl = normal.parentNode.querySelector('.autocomplete-content');

      focus(normal);
      normal.value = 'e';
      keyup(normal, 69);
      setTimeout(function() {
        expect(autocompleteEl.children.length).toEqual(2, 'Results should show dropdown on text input');
        done();
      }, 200);
    });

  it("should open correctly from keyboard focus", function (done) {
      let normal = document.querySelector('#normal-autocomplete');
      let autocompleteEl = normal.parentNode.querySelector('.autocomplete-content');
      
      normal.value = 'e';
      keyup(normal, 9);
      focus(normal);
      setTimeout(function() {
        expect(autocompleteEl.children.length).toEqual(2, 'Results should show dropdown on text input');
        done();
      }, 200);
    });

    it("should select option on click", function(done) {
      let normal = document.querySelector('#normal-autocomplete');

      M.Autocomplete.init(normal, { data: [{id: 'Value A'}], minLength: 0 });

      openDropdownAndSelectFirstOption(normal, () => {
        expect(normal.value).toEqual('Value A', 'Value should equal chosen option.');
        done();
      });
    });

    it("should select proper options on both autocompletes", function(done) {
      let normal = document.querySelector('#normal-autocomplete');
      let limited = document.querySelector('#limited-autocomplete');
      M.Autocomplete.init(normal, { data: [{id: 'Value A'}], minLength: 0 });
      M.Autocomplete.init(limited, { data: [{id: 'Value B'}],  minLength: 0 });
      openDropdownAndSelectFirstOption(normal, () => {
        openDropdownAndSelectFirstOption(limited, () => {
          expect(normal.value).toEqual('Value A', 'Value should equal chosen option.');
          expect(limited.value).toEqual('Value B', 'Value should equal chosen option.');
          done();
        });
      });
    });
  });

  function openDropdownAndSelectFirstOption(autocomplete, onFinish) {
    click(autocomplete);
    keyup(autocomplete, 9); // works

    setTimeout(function() {
      let firstOption = autocomplete.parentNode.querySelector('.autocomplete-content li');
      click(firstOption);
      
      setTimeout(function() {
        onFinish();
      }, 100);

    }, 300);
  }
});
