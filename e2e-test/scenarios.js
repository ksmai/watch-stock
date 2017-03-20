describe('Watch Stock Application', function() {
  const chart = element(by.css('.google-visualization-atl'));
  const input = element(by.model('vm.newSymbol'));
  const submit = element(by.css('[type="submit"]'));
  const modal = element(by.css('.modal'));
  const symbols = element.all(
    by.repeater('symbol in vm.symbolSync.symbols')
  );

  beforeEach(function() {
    browser.get('/');
  });

  it('let user enter a symbol', function() {
    const symbol = 'abc';
    input.sendKeys(symbol);

    submit.click();
    expect(input.getAttribute('value')).toEqual(symbol.toUpperCase());
  });

  it('shows a google chart', function() {
    expect(chart.isPresent()).toBe(true);
  });

  it('shows a list of current symbols', function() {
    expect(symbols.count()).toBeGreaterThan(0);
  });

  it('shows the stock latest return', function() {
    expect(symbols.first().element(by.css('.card-body')).getText()).
      toMatch(/^-?\d\.\d{4}%\s*@\d{4}-\d{2}-\d{2}$/);
  });

  it('shows and closes modal of chart on click', function() {
    expect(modal.isDisplayed()).toBe(false);
    symbols.first().element(by.css('.card-body')).click();
    expect(modal.isDisplayed()).toBe(true);
    expect(modal.element(by.css('.google-visualization-atl')).isPresent()).
      toBe(true);
    browser.actions().mouseMove(modal, { x: 0, y: 0 }).click().perform();
    expect(modal.isDisplayed()).toBe(false);
  });
});
