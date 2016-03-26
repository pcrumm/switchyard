module.exports = {
    /**
     * We specify aliases in the format 'alias path':'map path'.
     * Currently, aliases apply to /all/ matching verbs for the path.
     */
    '/alias-test': '/test', // To test basic aliasing
    '/alias-2-test': '/test', // To test multiple aliasing
    '/alias-test/deep/path': '/test/testing', // To verify path independence
    '/testing/named/:id': '/test/named/:id', // To test named routes
    '/broken-path-test': '/endpoint/is/fake' // To ensure error conditions are preserved
};
