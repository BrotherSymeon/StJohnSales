

suite('Global Tests', function(){
  test('page has valid title', function(){
    console.log(`document title= ${document.title}`);
    assert(document.title && document.title.match(/\S/) && document.title.toUpperCase() !== 'TODO', 'should be valid');
  });
});