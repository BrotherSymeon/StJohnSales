//about page tests
suite('"About" page tests', function(){
  test('page should contain link to contact page', function(){
    assert(document.querySelector('a[href="/contact"]') !== null, 'should have a link to the contact page');
  });
});