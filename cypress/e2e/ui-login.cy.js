describe('AsclepiusLM E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
    
    cy.intercept('POST', '/api/chat', [
      { generated_text: "IMPRESSION: Normal chest radiograph." }
    ]).as('getRadiologySummary')
  })

  it('loads the correct branding and title', () => {
    cy.get('.logo h1').should('be.visible').and('contain', 'AsclepiusLM')
    cy.get('img[alt="rod-of-asclepius"]').should('be.visible')
  })

  it('submits text and displays the AI response', () => {
    const reportText = "Heart size is normal. Lungs are clear."
    
    cy.get('#inputText').type(`${reportText}{enter}`)

    cy.get('.outputText p').should('contain', 'Please wait...')

    cy.wait('@getRadiologySummary')

    cy.get('.outputText p').should('contain', 'IMPRESSION: Normal chest radiograph.')
    
    cy.get('.stats p').should('contain', 'Latency:')
  })

  it('toggles the history panel and displays entries', () => {
    cy.get('#inputText').type('Sample report{enter}')
    cy.wait('@getRadiologySummary')

    cy.get('#toggleHistory').click()

    cy.get('#historyPanel').should('have.class', 'open')

    cy.get('.historyBar .pair').should('exist')
    cy.get('.historyBar .request p').should('contain', 'Sample report')
  })

  it('copies the output text to the clipboard when clicked', () => {
    const testOutput = 'Test text to copy';
    cy.get('.outputText p').invoke('text', testOutput)

    cy.get('.outputText p').click()

    cy.get('.copy-popup').should('be.visible').and('contain', 'Copied to clipboard!')
  })
})