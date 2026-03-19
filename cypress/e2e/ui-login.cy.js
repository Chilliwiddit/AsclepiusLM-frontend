describe('AsclepiusLM Simplified E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
    
    cy.intercept('POST', '/api/chat', [
      { generated_text: "IMPRESSION: Normal summary." }
    ]).as('getChat')
  })

  it('loads the homepage', () => {
    cy.get('.logo h1').should('contain', 'AsclepiusLM')
  })

  it('updates the output area after typing', () => {
    cy.get('#inputText').type('Scan report content{enter}')
    
    cy.wait('@getChat')

    cy.get('.outputText p').should('not.be.empty')
    cy.get('.outputText p').should('contain', 'IMPRESSION: Normal summary.')
  })

  it('opens the history panel on click', () => {
    cy.get('#toggleHistory').click()
    cy.get('#historyPanel').should('have.class', 'open')
  })

  it('displays the copy popup when output is clicked', () => {
    cy.get('.outputText p').invoke('text', 'Sample text')
    
    cy.get('.outputText p').click()

    cy.get('div').should('have.class', 'copy-popup')
    cy.get('.copy-popup').should('contain', 'Copied')
  })
})