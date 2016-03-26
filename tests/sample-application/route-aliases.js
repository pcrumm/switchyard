module.exports = {
    /**
     * We specify aliases in the format 'alias path':'map path'.
     * Currently, aliases apply to /all/ matching verbs for the path.
     */
    '/alias-test': '/test', // To test basic aliasing
    '/alias-2-test': '/test', // To test multiple aliasing
    '/alias-test/deep/path': '/test/testing', // To verify path independence
    '/testing/named/:id': '/test/named/:id', // To test named routes
    '/broken-path-test': '/endpoint/is/fake', // To ensure error conditions are preserved
    'no-prefix-test': '/test/testing', // To verify that aliases are not required to have a prefix
    '/true-no-prefix-test': 'test', // To verify that true routes are not required to have a prefix
    'both-have-no-prefix': 'test/testing', // To verify that both routes are not required to have a prefix
};
