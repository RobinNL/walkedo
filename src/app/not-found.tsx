import Styles from '@/app/not-found.module.scss';

export default function page () {

    return (
        <main className={Styles.notHereContainer}>
            <div>
                <h2>Oh nee! Een hond is de bal kwijt</h2>
                <p>
                    Wij konden de pagina helaas niet vinden. Maar we hebben een labradoodle om hulp gevraagd.
                </p>
            </div>
        </main>
    )

}