suite('"About" Page Tests', function(){
    test('pages should contain link to contact page', function(){
        assert($('a[href="/contact"]').length);
    });
});