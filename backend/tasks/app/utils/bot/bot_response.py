import json
import os
from .prompt import prompt_system
from crewai import Agent, Task, Crew
from crewai_tools import tool
from dotenv import load_dotenv
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_openai import ChatOpenAI

load_dotenv()

@tool('DuckDuckGoSearch')
def search(search_query: str):
    """Pesquise na web informações sobre um determinado tópico"""
    return DuckDuckGoSearchRun(verbose=True).run(search_query)

def generate_response(analyze_task):
    try:
        llm = ChatOpenAI(model=os.getenv('OPEN_AI_MODEL'),
                            temperature=0,
                            max_tokens=4096,
                            timeout=40,
                            max_retries=2,
                            api_key=os.getenv('OPEN_AI_KEY')
                        )
        
        writer = Agent(role='system', 
                        goal='Identificar uma possível solução para a tarefa do usuário',
                        backstory='O usuário irá passar uma tarefa com um titulo e uma descrição, sua função será fornecer uma resposta de como pode ser feito aquela tarefa',
                        verbose=True, allow_delegation=False, llm=llm, tool=[search]
                    )
        prompt = prompt_system(analyze_task=analyze_task)

        task = Task(description=prompt, agent=writer, expected_output='JSON')

        crew = Crew(agents=[writer,], tasks=[task,], verbose=2)
        result = crew.kickoff()
        response = json.loads(result, strict=False)

        return response
    
    except Exception as e:
        return {'error': f'{str(e)}'}