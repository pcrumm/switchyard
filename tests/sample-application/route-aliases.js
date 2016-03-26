module.exports = {
    /**
     * We specify aliases in the format 'alias path':'map path'.
     * Currently, aliases apply to /all/ matching verbs for the path.
     */
    '/alias-test': '/test',
    '/alias-test/deep/path': '/test/testing',
    '/testing/named/:id': '/test/named/:id',
    '/broken-path-test': '/endpoint/is/fake'
};
